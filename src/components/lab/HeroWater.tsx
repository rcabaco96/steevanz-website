"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Water light over the hero: slow caustic veins drifting across the screen, with a
 * faint prismatic fringe, and soft ripples that trail the mouse. Drawn on its own
 * small WebGL canvas above the scene (pointer-events none), at reduced resolution.
 * `strength` (0..1) fades it with the hero; at 0 it stops rendering entirely.
 */

const TRAIL = 20;

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uStrength;
uniform float uLight;
uniform vec4 uTrail[${TRAIL}]; // xy: px, z: age (s), w: speed weight

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

// Caustic veins: ridges of a slowly warped noise field, two scales. Fine bright lines
// (high power) over a soft glow (low power), so the light reads as depth, not marks.
float caustic(vec2 q, float t) {
  vec2 w = vec2(noise(q * 0.7 + vec2(t * 0.11, -t * 0.07)), noise(q * 0.7 + vec2(5.2 - t * 0.09, 1.3 + t * 0.1)));
  q += w * 0.9;
  float a = 1.0 - abs(noise(q + vec2(0.0, t * 0.05)));
  float b = 1.0 - abs(noise(q * 1.9 + vec2(3.1, -t * 0.08)));
  float lines = pow(a, 14.0) * 0.6 + pow(b, 16.0) * 0.3;
  float glow = pow(a, 4.0) * 0.16;
  return lines + glow;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  float scale = 4.2 / min(uRes.x, uRes.y) * 1.6;

  // Mouse ripples: expanding rings that bend the light and catch a little of it.
  vec2 bend = vec2(0.0);
  float ring = 0.0;
  for (int k = 0; k < ${TRAIL}; k++) {
    vec4 tr = uTrail[k];
    if (tr.w <= 0.0) continue;
    vec2 d = px - tr.xy;
    float dist = length(d);
    float radius = tr.z * 260.0 + 6.0;
    float x = (dist - radius) / 38.0;
    float life = exp(-tr.z * 2.6) * tr.w;
    float wave = sin(x * 3.2) * exp(-x * x) * life;
    bend += (d / max(dist, 1.0)) * wave * 12.0;
    ring += exp(-x * x * 1.6) * life;
  }

  vec2 q = (px + bend) * scale;
  float t = uTime * 0.8;
  // Prismatic fringe: red and blue read the veins a hair apart.
  vec2 shift = vec2(0.008, 0.005) + bend * scale * 0.03;
  float r = caustic(q + shift, t);
  float g = caustic(q, t);
  float b = caustic(q - shift, t);
  vec3 light = vec3(r, g, b);

  // Large slow swell so the light gathers and thins across the screen.
  float swell = 0.55 + 0.45 * noise(px * scale * 0.18 + vec2(t * 0.03, -t * 0.02));
  light *= swell;
  light += vec3(ring * 0.035);

  // Quieter in the middle, where the title sits; fuller towards the edges.
  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  uv.x *= uRes.x / uRes.y;
  float calm = mix(0.45, 1.0, smoothstep(0.12, 0.7, length(uv)));

  float lum = max(max(light.r, light.g), light.b);
  vec3 fringe = light / max(lum, 0.001);
  if (uLight > 0.5) {
    // Light theme: the caustics are drawn as deep plum, multiplied into the warm wall
    // (light-on-light would vanish). The prismatic fringe survives as a slight hue shift.
    float alpha = clamp(lum, 0.0, 1.0) * calm * uStrength * 0.34;
    vec3 ink = mix(vec3(0.34, 0.15, 0.32), vec3(0.34, 0.15, 0.32) * fringe, 0.35);
    gl_FragColor = vec4(ink * alpha, alpha);
  } else {
    float alpha = clamp(lum, 0.0, 1.0) * calm * uStrength * 0.24;
    vec3 tint = mix(fringe, vec3(1.0), 0.35);
    gl_FragColor = vec4(tint * alpha, alpha);
  }
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[HeroWater]", gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export function HeroWater({ strength, light }: { strength: MutableRefObject<number>; light: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef(light);

  useEffect(() => {
    lightRef.current = light;
  }, [light]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    // Decoration only: skip it on software / blocklisted GPUs rather than slow the page.
    const gl = el.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl || gl.isContextLost()) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[HeroWater]", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);
    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uStrength = gl.getUniformLocation(program, "uStrength");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uTrail = gl.getUniformLocation(program, "uTrail");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Half resolution: the light is soft, so this costs little and saves a lot.
    const ratio = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(el.clientWidth * ratio));
      const h = Math.max(1, Math.round(el.clientHeight * ratio));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // Ripple trail: a new drop every ~28 px of mouse travel, oldest dropped first.
    const trail = new Float32Array(TRAIL * 4);
    const born = new Float64Array(TRAIL);
    let head = 0;
    let lastX = -1e4;
    let lastY = -1e4;
    const onMove = (event: PointerEvent) => {
      if (!fine || reduced || strength.current < 0.02 || event.pointerType === "touch") return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < 28) return;
      lastX = event.clientX;
      lastY = event.clientY;
      const rect = el.getBoundingClientRect();
      const k = head % TRAIL;
      trail[k * 4] = (event.clientX - rect.left) * ratio;
      trail[k * 4 + 1] = (rect.bottom - event.clientY) * ratio;
      trail[k * 4 + 3] = Math.min(1, 0.35 + dist / 160);
      born[k] = performance.now();
      head++;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // The canvas stays hidden until a frame has drawn cleanly, and hides again if the
    // GPU drops the context, so a failure can never cover the hero.
    let dead = false;
    const hide = () => {
      dead = true;
      el.dataset.on = "false";
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      hide();
    };
    el.addEventListener("webglcontextlost", onLost);

    let frame = 0;
    let checked = false;
    const start = performance.now();
    const draw = (now: number) => {
      if (dead) return;
      frame = requestAnimationFrame(draw);
      const s = strength.current;
      if (s <= 0.005) {
        if (el.dataset.on === "true") {
          gl.clear(gl.COLOR_BUFFER_BIT);
          el.dataset.on = "idle";
        }
        return;
      }
      for (let k = 0; k < TRAIL; k++) {
        if (trail[k * 4 + 3] <= 0) continue;
        const age = (now - born[k]) / 1000;
        if (age > 2.2) trail[k * 4 + 3] = 0;
        trail[k * 4 + 2] = age;
      }
      gl.uniform2f(uRes, el.width, el.height);
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl.uniform1f(uStrength, s);
      gl.uniform1f(uLight, lightRef.current ? 1 : 0);
      gl.uniform4fv(uTrail, trail);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!checked) {
        checked = true;
        if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) return hide();
      }
      el.dataset.on = "true";
    };
    frame = requestAnimationFrame(draw);

    return () => {
      // Release our GPU objects but keep the context alive: React may run this effect
      // again on the same canvas (Strict Mode), and a lost context can't be recovered.
      dead = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      el.dataset.on = "false";
    };
  }, [strength]);

  return <canvas ref={canvas} className="hero-water" data-on="false" aria-hidden="true" />;
}
