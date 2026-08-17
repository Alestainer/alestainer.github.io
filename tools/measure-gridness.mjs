function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function poisson(rng,n){const p=[];for(let i=0;i<n;i++)p.push([rng(),rng()]);return p;}
function hardcore(rng,n,r){const pts=[],r2=r*r;let a=0,max=n*8000;
  while(pts.length<n&&a<max){a++;const p=[rng(),rng()];let ok=true;
    for(const q of pts){const dx=q[0]-p[0],dy=q[1]-p[1];if(dx*dx+dy*dy<r2){ok=false;break;}}
    if(ok)pts.push(p);}return{pts,ok:pts.length===n};}
function nndArr(p){return p.map((a,i)=>{let m=Infinity;p.forEach((b,j)=>{if(i!==j){const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d<m)m=d;}});return m;});}
function cv(a){const m=a.reduce((x,y)=>x+y,0)/a.length;const v=a.reduce((x,y)=>x+(y-m)**2,0)/a.length;return Math.sqrt(v)/m;}
function cells(p,k){const c=new Array(k*k).fill(0);for(const[x,y]of p){const i=Math.min(k-1,Math.floor(x*k)),j=Math.min(k-1,Math.floor(y*k));c[j*k+i]++;}return c;}
function vmr(c){const m=c.reduce((a,b)=>a+b,0)/c.length;const v=c.reduce((a,b)=>a+(b-m)**2,0)/c.length;return v/m;}
const N=120;
let pc=0,pv=0;
for(let s=0;s<120;s++){const p=poisson(mulberry32(s*7919+3),N);pc+=cv(nndArr(p));pv+=vmr(cells(p,6));}
console.log(`POISSON reference:  CV(nnd)=${(pc/120).toFixed(3)}   VMR=${(pv/120).toFixed(3)}\n`);
console.log("minSep  CV(nnd)  VMR    grid-ness            illusion strength");
for(const r of [0.028,0.032,0.036,0.040,0.044,0.048,0.052,0.058]){
  let C=0,V=0,ok=0;
  for(let s=0;s<120;s++){const h=hardcore(mulberry32(s*7919+3),N,r);if(!h.ok)continue;ok++;C+=cv(nndArr(h.pts));V+=vmr(cells(h.pts,6));}
  const c=C/ok,v=V/ok;
  const grid = c<0.18?"VERY grid-like":c<0.25?"grid-like":c<0.32?"slightly regular":c<0.40?"natural":"near-Poisson";
  const ill  = v<0.35?"very strong":v<0.5?"strong":v<0.65?"moderate":v<0.8?"weak":"none";
  console.log(`${r.toFixed(3)}   ${c.toFixed(3)}    ${v.toFixed(3)}  ${grid.padEnd(20)} ${ill}`);
}
