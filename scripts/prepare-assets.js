import fs from 'node:fs';
import vm from 'node:vm';

// One-time preparation of the small, local Lucide sprite from its pinned ISC release.
const sandbox={};
vm.createContext(sandbox);
const iconResponse=await fetch('https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js',{signal:AbortSignal.timeout(30000)});
if(!iconResponse.ok) throw new Error('Lucide source unavailable');
vm.runInContext(await iconResponse.text(),sandbox);
const names=['MapPinned','Search','Sun','Moon','ChevronRight','ChevronDown','ArrowLeft','ArrowUpRight','X','Phone','MapPin','Navigation','Clock3','ShieldCheck','Syringe','Pill','Thermometer','Building2','SlidersHorizontal','Check','LocateFixed','Layers','Map','ArrowRight','Menu','TriangleAlert','Copy','Expand','RefreshCw','SearchX','Globe2'];
const attributes=attrs=>Object.entries(attrs).map(([k,v])=>`${k}="${String(v).replaceAll('"','&quot;')}"`).join(' ');
const symbols=names.map(name=>{
  const node=sandbox.lucide.icons[name];
  if(!node) throw new Error('Missing icon '+name);
  const id=name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
  const children=node[2].map(([tag,attrs])=>`<${tag} ${attributes(attrs)}/>`).join('');
  return `<symbol id="${id}" viewBox="0 0 24 24">${children}</symbol>`;
});
fs.writeFileSync('assets/icons.svg','<svg xmlns="http://www.w3.org/2000/svg">'+symbols.join('')+'</svg>');

const fonts=[['DM Sans','DM+Sans','400..700'],['Manrope','Manrope','400..800']];
let css='/* Locally served Google Fonts. Licenses are in this directory. */\n';
for(const [name,family,weight] of fonts){
  const response=await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,{headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'},signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw new Error('Font stylesheet unavailable');
  let sheet=await response.text();
  const urls=[...new Set([...sheet.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)\s]+/g)].map(m=>m[0]))];
  for(let n=0;n<urls.length;n++){
    const file=name.replaceAll(' ','-').toLowerCase()+'-'+n+'.woff2';
    const r=await fetch(urls[n],{signal:AbortSignal.timeout(30000)});
    if(!r.ok) throw new Error('Font unavailable');
    fs.writeFileSync('assets/fonts/'+file,Buffer.from(await r.arrayBuffer()));
    sheet=sheet.replaceAll(urls[n],file);
  }
  css+=sheet+'\n';
}
fs.writeFileSync('assets/fonts/fonts.css',css.trimEnd()+'\n');
for(const [family,file] of [['dmsans','DM-SANS-OFL.txt'],['manrope','MANROPE-OFL.txt']]){
  const response=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,{signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw new Error('Font license unavailable');
  fs.writeFileSync('assets/fonts/'+file,(await response.text()).replace(/[ \t]+$/gm,'').trimEnd()+'\n');
}
console.log('Local icon sprite and fonts prepared.');
