function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function poisson(rng,n){const p=[];for(let i=0;i<n;i++)p.push([rng(),rng()]);return p;}
function hardcore(rng,n,r){const pts=[],r2=r*r;let a=0,max=n*4000;
  while(pts.length<n&&a<max){a++;const p=[rng(),rng()];let ok=true;
    for(const q of pts){const dx=q[0]-p[0],dy=q[1]-p[1];if(dx*dx+dy*dy<r2){ok=false;break;}}
    if(ok)pts.push(p);}
  return {pts,attempts:a,achieved:pts.length};}
function nnd(pts){return pts.map((p,i)=>{let m=Infinity;pts.forEach((q,j)=>{if(i!==j){const d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<m)m=d;}});return m;});}
function cells(pts,k){const c=new Array(k*k).fill(0);for(const[x,y]of pts){const i=Math.min(k-1,Math.floor(x*k)),j=Math.min(k-1,Math.floor(y*k));c[j*k+i]++;}return c;}
function stats(a){const s=[...a].sort((x,y)=>x-y);const m=a.reduce((p,c)=>p+c,0)/a.length;
  const v=a.reduce((p,c)=>p+(c-m)**2,0)/a.length;return{mean:m,sd:Math.sqrt(v),min:s[0],max:s[s.length-1]};}
const N=120, R=0.058, K=6;
let ach=[],att=[],vmrP=[],vmrH=[],nnP=[],nnH=[],maxCellP=[],maxCellH=[];
for(let s=0;s<200;s++){
  const p=poisson(mulberry32((20260817+s*2654435761)>>>0 ^ 0x9e3779b9),N);
  const h=hardcore(mulberry32((20260817+s*2654435761)>>>0 ^ 0x85ebca6b),N,R);
  ach.push(h.achieved); att.push(h.attempts);
  const cp=cells(p,K), ch=cells(h.pts,K);
  const sp=stats(cp), sh=stats(ch);
  vmrP.push(sp.sd**2/sp.mean); vmrH.push(sh.sd**2/sh.mean);
  maxCellP.push(sp.max); maxCellH.push(sh.max);
  nnP.push(stats(nnd(p)).mean); nnH.push(stats(nnd(h.pts)).mean);
}
const f=x=>x.toFixed(3);
console.log(`params: N=${N} minSep=${R} grid=${K}x${K} (${K*K} cells, mean ${(N/(K*K)).toFixed(2)}/cell), 200 seeds`);
console.log(`hardcore achieved n : mean ${stats(ach).mean.toFixed(1)}  min ${stats(ach).min}  max ${stats(ach).max}   <-- must be ${N}`);
console.log(`hardcore attempts   : mean ${Math.round(stats(att).mean)}  max ${stats(att).max}`);
console.log(`nearest-neighbour d : poisson ${f(stats(nnP).mean)}   hardcore ${f(stats(nnH).mean)}   ratio ${(stats(nnH).mean/stats(nnP).mean).toFixed(2)}x`);
console.log(`variance/mean ratio : poisson ${f(stats(vmrP).mean)} (theory 1.00)   hardcore ${f(stats(vmrH).mean)}`);
console.log(`busiest cell count  : poisson ${f(stats(maxCellP).mean)}   hardcore ${f(stats(maxCellH).mean)}`);
