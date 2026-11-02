import fs from 'fs';
const b = fs.readFileSync(process.argv[2]);
const jlen = b.readUInt32LE(12);
const j = JSON.parse(b.slice(20, 20 + jlen).toString());
const binStart = 20 + jlen + 8;
const out = { asset: j.asset, extensionsUsed: j.extensionsUsed, scenes: j.scenes, nodes: j.nodes, meshes: j.meshes, materials: j.materials, textures: j.textures, images: j.images, samplers: j.samplers, accessors: j.accessors.map(a => ({ ...a })), extras: j.extras };
console.log(JSON.stringify(out, null, 1));
fs.mkdirSync(process.argv[3], { recursive: true });
j.images.forEach((im, i) => {
  const bv = j.bufferViews[im.bufferView];
  const data = b.slice(binStart + (bv.byteOffset || 0), binStart + (bv.byteOffset || 0) + bv.byteLength);
  const ext = im.mimeType.includes('png') ? 'png' : 'jpg';
  fs.writeFileSync(`${process.argv[3]}/img${i}.${ext}`, data);
  console.log('image', i, im.mimeType, data.length, 'w', data.indexOf(Buffer.from([0xff,0xc0])) );
});
