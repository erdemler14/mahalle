import fs from 'node:fs';
import path from 'node:path';

const directory=path.resolve('public/models');
const files=fs.readdirSync(directory).filter(x=>x.endsWith('.glb'));
if(files.length!==24)throw new Error('Expected 24 GLB models; found '+files.length);
let bytes=0;
for(const filename of files) {
  const buffer=fs.readFileSync(path.join(directory,filename));
  bytes+=buffer.length;
  if(buffer.length<100 || buffer.readUInt32LE(0)!==0x46546c67)throw Error('Not a GLB: '+filename);
  if(buffer.readUInt32LE(4)!==2 || buffer.readUInt32LE(8)!==buffer.length)throw Error('Bad GLB header '+filename);
  const jsonLength=buffer.readUInt32LE(12);
  if(buffer.readUInt32LE(16)!==0x4e4f534a || jsonLength%4!==0)throw Error('Invalid JSON chunk '+filename);
  const json=JSON.parse(buffer.subarray(20,20+jsonLength).toString('utf8'));
  const binStart=20+jsonLength;
  const binLength=buffer.readUInt32LE(binStart);
  if(buffer.readUInt32LE(binStart+4)!==0x004e4942 || binStart+8+binLength!==buffer.length)throw Error('Invalid BIN chunk '+filename);
  if(!json.asset || json.asset.version!=='2.0'||!json.meshes?.[0]?.primitives?.length)throw Error('Invalid glTF core '+filename);
  if(!json.images?.length||!json.materials?.length||!json.textures?.length)throw Error('No embedded PBR assets '+filename);
  if(json.buffers[0].byteLength>binLength)throw Error('GLB buffer overflow '+filename);
  for(const [i,view] of json.bufferViews.entries()) {
    if(view.byteOffset<0 || view.byteLength<=0 || view.byteOffset+view.byteLength>binLength)throw Error('BufferView '+i+' out of bounds in '+filename);
  }
  for(const [i,a] of json.accessors.entries()) {
    if(!Number.isInteger(a.bufferView)||!json.bufferViews[a.bufferView])throw Error('Accessor '+i+' missing buffer '+filename);
    const size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
    const componentSize={5121:1,5123:2,5125:4,5126:4}[a.componentType];
    if(!size||!componentSize||!a.count)throw Error('Invalid accessor '+i+' in '+filename);
    if(a.count*size*componentSize>json.bufferViews[a.bufferView].byteLength)throw Error('Accessor length mismatch '+filename);
  }
  for(const [i,img] of json.images.entries()){
    const view=json.bufferViews[img.bufferView];
    if(!view || img.mimeType!=='image/png')throw Error('Invalid image '+i+' in '+filename);
    const png=buffer.subarray(binStart+8+view.byteOffset,binStart+8+view.byteOffset+8);
    if(png.toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid embedded PNG '+filename);
  }
  for(const mesh of json.meshes)for(const p of mesh.primitives) {
    if(!p.attributes?.POSITION||!p.attributes?.NORMAL||!p.attributes?.TEXCOORD_0) {
      // Accessor index zero is legitimate.
      if(p.attributes?.POSITION==null||p.attributes?.NORMAL==null||p.attributes?.TEXCOORD_0==null)
        throw Error('Missing mesh attributes '+filename);
    }
    if(p.indices==null||p.material==null)throw Error('Missing mesh indices/material '+filename);
  }
}
console.log('Validated '+files.length+' binary GLB models ('+(bytes/1024/1024).toFixed(2)+' MB total): embedded PBR maps and glTF accessors are structurally valid.');
