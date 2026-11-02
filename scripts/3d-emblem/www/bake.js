import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const p = new URLSearchParams(location.search);
const W = +p.get("w"), H = +p.get("h");
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
let mesh, box, mats;
window.init = async (url) => {
  const gltf = await new GLTFLoader().loadAsync(url);
  gltf.scene.traverse((o) => { if (o.isMesh) mesh = o; });
  box = new THREE.Box3().setFromObject(mesh);
  scene.add(gltf.scene);
  const src = mesh.material;
  const zmin = box.min.z, zmax = box.max.z;
  mats = {
    albedo: new THREE.MeshBasicMaterial({ map: src.map, side: THREE.DoubleSide }),
    normal: new THREE.MeshNormalMaterial({ normalMap: src.normalMap, normalScale: src.normalScale.clone(), side: THREE.DoubleSide }),
    geonormal: new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    height: new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: { zmin: { value: zmin }, zmax: { value: zmax } },
      vertexShader: "varying float vz; void main(){ vz = position.z; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "uniform float zmin; uniform float zmax; varying float vz; void main(){ float h = clamp((vz-zmin)/(zmax-zmin),0.0,1.0)*65535.0; float hi = floor(h/256.0); float lo = h - hi*256.0; gl_FragColor = vec4(hi/255.0, lo/255.0, 0.0, 1.0); }",
    }),
  };
  return { min: box.min.toArray(), max: box.max.toArray() };
};
window.pass = (name, front = true) => {
  mesh.material = mats[name];
  const cam = new THREE.OrthographicCamera(box.min.x, box.max.x, box.max.y, box.min.y, 0.01, 10);
  if (front) cam.position.set(0, 0, 5); else { cam.position.set(0, 0, -5); cam.left = -box.max.x; cam.right = -box.min.x; }
  cam.lookAt(0, 0, front ? -10 : 10); cam.updateProjectionMatrix();
  // linear output for data passes
  renderer.outputColorSpace = name === "albedo" ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
  renderer.setClearColor(name === "height" ? 0x000000 : name === "albedo" ? 0x000000 : 0x8080ff, name === "albedo" ? 0 : 1);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL("image/png");
};
window.ready = true;
