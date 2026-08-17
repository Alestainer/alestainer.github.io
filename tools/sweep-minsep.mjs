function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function hardcore(rng,n,r){const pts=[],r2=r*r;let a=0,max=n*4000;
  while(pts.length<n&&a<max){a++;const p=[rng(),rng()];let ok=true;
    for(const q of pts){const dx=q[0]-p[0],dy=q[1]-p[1];if(dx*dx+dy*dy<r2){ok=false;break;}}
    if(ok)pts.push(p);}return{pts,ok:pts.length===n,attempts:a};}
function cells(pts,k){const c=new Array(k*k).fill(0);for(const[x,y]of pts){const i=Math.min(k-1,Math.floor(x*k)),j=Math.min(k-1,Math.floor(y*k));c[j*k+i]++;}return c;}
function vmr(c){const m=c.reduce((a,b)=>a+b,0)/c.length;const v=c.reduce((a,b)=>a+(b-m)**2,0)/c.length;return v/m;}
function nnd(p){let s=0;p.forEach((a,i)=>{let m=Infinity;p.forEach((b,j)=>{if(i!==j){const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d<m)m=d;}});s+=m;});return s/p.length;}
const N=120;
console.log("minSep  VMR    NNratio  fail%  attempts   read");
for(const r of [0.035,0.045,0.050,0.055,0.058,0.062,0.066,0.070]){
  let V=0,NN=0,fails=0,att=0,ok=0;
  for(let s=0;s<120;s++){
    const h=hardcore(mulberry32((s*2654435761+7)>>>0),N,r);
    if(!h.ok){fails++;continue;}
    ok++; V+=vmr(cells(h.pts,6)); NN+=nnd(h.pts); att+=h.attempts;
  }
  const v=V/ok, nn=NN/ok/0.0456;
  const read = v>0.75?"too subtle":v>0.5?"subtle":v>0.25?"good zone":v>0.15?"getting obvious":"visibly regular";
  console.log(`${r.toFixed(3)}   ${v.toFixed(3)}  ${nn.toFixed(2)}x    ${(fails/120*100).toFixed(0)}%   ${Math.round(att/ok)}      ${read}`);
}
