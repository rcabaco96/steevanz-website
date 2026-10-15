"use client";

import { useEffect, useRef } from "react";

// The hero's moving background: a slow marbled swirl, like gelato being worked in the tray, in the colours
// of the flavour picked. Plain WebGL (no library, about 3 KB): drawn at a fraction of the screen's
// resolution (the swirl is soft anyway), at most 30 frames a second, and paused when off screen or in a
// hidden tab. Loaded only after the page is idle; the CSS backdrop under it is the fallback.

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 bg;uniform float dark;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/r;vec2 q=uv*vec2(r.x/r.y,1.)*1.35;
q+=(m-.5)*.18;
float a=fbm(q+vec2(t*.035,-t*.02));
float b=fbm(q*1.25+vec2(a*2.2,a*1.4)+vec2(-t*.03,t*.025));
float s=smoothstep(.32,.78,b);
vec3 col=mix(c1,c2,s*.85);
float d=fbm(q*2.1+b*1.6+t*.02);
col=mix(col,c3,smoothstep(.6,.92,d)*.5);
float ridge=1.-abs(sin(b*14.+t*.15));
col+=vec3(1.)*pow(ridge,18.)*.10;
col=mix(col,bg,.18+.62*dark);
col+=(h(gl_FragCoord.xy+t)-.5)*.025;
gl_FragColor=vec4(col,1.);}`;

function hex(color: string): [number, number, number] {
  const value = Number.parseInt(color.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

interface GelatoShaderProps {
  /** Three colours, light to deep. */
  colors: readonly [string, string, string];
  className?: string;
}

export default function GelatoShader({ colors, className = "" }: GelatoShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef<number[][]>(colors.map(hex));

  useEffect(() => {
    target.current = colors.map(hex);
  }, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("r"), uTime = u("t"), uC1 = u("c1"), uC2 = u("c2"), uC3 = u("c3"), uBg = u("bg"), uDark = u("dark"), uMouse = u("m");

    const current = target.current.map((c) => [...c]);
    const mouse = [0.5, 0.5];
    const mouseTarget = [0.5, 0.5];
    let visible = true;
    let frame = 0;
    let last = 0;
    let start = performance.now();
    let shown = false;

    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.45;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < 33) return;
      last = now;
      for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) current[i][k] += (target.current[i][k] - current[i][k]) * 0.06;
      mouse[0] += (mouseTarget[0] - mouse[0]) * 0.05;
      mouse[1] += (mouseTarget[1] - mouse[1]) * 0.05;
      const dark = isDark();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform3fv(uC1, current[0]);
      gl.uniform3fv(uC2, current[1]);
      gl.uniform3fv(uC3, current[2]);
      gl.uniform3fv(uBg, dark ? [0.055, 0.106, 0.086] : [0.969, 0.949, 0.91]);
      gl.uniform1f(uDark, dark ? 1 : 0);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
    };

    const play = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    intersection.observe(canvas);

    const onVisibility = () => play();
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseTarget[0] = event.clientX / window.innerWidth;
      mouseTarget[1] = 1 - event.clientY / window.innerHeight;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      canvas.style.opacity = "0";
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    start = performance.now();
    play();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`opacity-0 transition-opacity duration-[1.4s] ${className}`} />;
}
