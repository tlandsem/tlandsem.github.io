function toggleMenu() { document.getElementById('nav-menu').classList.toggle('open'); }
document.querySelectorAll('#nav-menu a').forEach(link => { link.addEventListener('click', () => { document.getElementById('nav-menu').classList.remove('open'); }); });
const canvas = document.getElementById('c'); const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', () => { resize(); initNodes(); });
const GLYPHS = '01アイウエオABCDEF<>{}[]//\\&&||::?!#$%^*'.split('');
let nodes = [], links = [], packets = [], glyphs = [];
function rand(a, b) { return a + Math.random() * (b - a); }
function initNodes() {
  const W = canvas.width, H = canvas.height; const count = Math.floor(W * H / 13000); nodes = [];
  for (let i = 0; i < count; i++) { nodes.push({ x: rand(40,W-40), y: rand(40,H-40), r: rand(2,4.5), vx: rand(-0.03,0.03), vy: rand(-0.03,0.03), pulseT: rand(0,Math.PI*2), type: Math.random()<0.1?'hub':'node' }); }
  links = [];
  for (let i = 0; i < nodes.length; i++) { for (let j = i+1; j < nodes.length; j++) { const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy),maxDist=nodes[i].type==='hub'||nodes[j].type==='hub'?190:115; if(d<maxDist)links.push({a:i,b:j,d}); } }
  packets = []; glyphs = [];
  for (let k = 0; k < 28; k++) { glyphs.push({ x:rand(0,W), y:rand(0,H), char:GLYPHS[Math.floor(Math.random()*GLYPHS.length)], alpha:rand(0.03,0.1), size:rand(10,20), vy:rand(0.07,0.22) }); }
}
function spawnPacket() { if(links.length===0)return; const link=links[Math.floor(Math.random()*links.length)]; const isCritical=Math.random()<0.08; packets.push({link,t:0,speed:rand(0.002,0.006),fwd:Math.random()<0.5,color:isCritical?'rgba(255,80,100,0.85)':'rgba(0,230,180,0.8)'}); }
let frame=0; const statusTexts=['ONLINE','FIREWALL: ACTIVE','ENCRYPTION: AES-256','PACKETS: 0 LOSS','TLS 1.3','THREAT LEVEL: LOW','NODES: SECURE']; let statusIdx=0;
function draw() {
  const W=canvas.width,H=canvas.height; ctx.fillStyle='#080d12'; ctx.fillRect(0,0,W,H);
  const gStep=50; ctx.strokeStyle='rgba(0,180,140,0.055)'; ctx.lineWidth=0.5;
  for(let x=0;x<W;x+=gStep){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=gStep){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  const vg=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.85); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.55)'); ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  for(const g of glyphs){ctx.save();ctx.globalAlpha=g.alpha;ctx.fillStyle='#00e5b3';ctx.font=`${g.size}px 'Courier New', monospace`;ctx.fillText(g.char,g.x,g.y);ctx.restore();g.y+=g.vy;if(g.y>H+30){g.y=-30;g.x=rand(0,W);g.char=GLYPHS[Math.floor(Math.random()*GLYPHS.length)];}}
  for(const lk of links){const a=nodes[lk.a],b=nodes[lk.b];const alpha=Math.max(0,1-lk.d/160)*0.55;ctx.strokeStyle=`rgba(0,200,160,${alpha*0.22})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(let i=packets.length-1;i>=0;i--){const pk=packets[i];pk.t+=pk.speed;if(pk.t>=1){packets.splice(i,1);continue;}const a=nodes[pk.link.a],b=nodes[pk.link.b];const t=pk.fwd?pk.t:1-pk.t;const px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t;ctx.beginPath();ctx.arc(px,py,2.2,0,Math.PI*2);ctx.fillStyle=pk.color;ctx.fill();ctx.beginPath();ctx.arc(px,py,5.5,0,Math.PI*2);ctx.fillStyle=pk.color.replace('0.8','0.12').replace('0.85','0.12');ctx.fill();}
  const t=frame*0.012;
  for(const n of nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<10||n.x>W-10)n.vx*=-1;if(n.y<10||n.y>H-10)n.vy*=-1;const pulse=0.5+0.5*Math.sin(t+n.pulseT);const r=n.type==='hub'?n.r*1.8:n.r;if(n.type==='hub'){ctx.beginPath();ctx.arc(n.x,n.y,r+7+pulse*5,0,Math.PI*2);ctx.fillStyle=`rgba(0,220,170,${0.04+pulse*0.05})`;ctx.fill();}ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=n.type==='hub'?`rgba(0,230,180,${0.75+pulse*0.2})`:`rgba(0,190,150,${0.35+pulse*0.25})`;ctx.fill();if(n.type==='hub'){ctx.beginPath();ctx.arc(n.x,n.y,r*0.35,0,Math.PI*2);ctx.fillStyle='rgba(200,255,240,0.8)';ctx.fill();}}
  if(frame%38===0)spawnPacket();
  if(frame%200===0){statusIdx=(statusIdx+1)%statusTexts.length;document.getElementById('status').textContent=statusTexts[statusIdx];}
  frame++;requestAnimationFrame(draw);
}
initNodes();draw();
