/* Browser-local clustering demonstrations. */
'use strict';
const palette=['#17665e','#b76b20','#7564a6','#277ba6','#b44864','#687928','#985c30','#4d6378'];
const kmPoints=[[16,21],[21,17],[24,28],[12,31],[29,20],[20,35],[32,31],[15,14],[65,20],[72,16],[77,27],[61,30],[69,35],[81,18],[75,38],[58,17],[43,66],[50,72],[55,62],[38,77],[48,83],[60,77],[34,61],[58,89]].map(([x,y],i)=>({x,y,id:i}));
const hp=[[15,18],[23,24],[36,16],[48,32],[66,57],[76,64],[59,79],[83,85]].map(([x,y],i)=>({x,y,id:i,label:'ABCDEFGH'[i]}));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function kHistory(points,centers){let cs=centers.map(p=>({...p})),history=[{phase:'start',centers:cs.map(p=>({...p})),assign:null,iteration:0}],old=null;
 for(let iter=1;iter<=100;iter++){
  const assign=points.map(p=>{let best=0;for(let j=1;j<cs.length;j++)if(distance(p,cs[j])<distance(p,cs[best]))best=j;return best;});
  const stable=old&&assign.every((g,i)=>g===old[i]);
  history.push({phase:stable?'done':'assign',centers:cs.map(p=>({...p})),assign:[...assign],iteration:iter,changed:old?assign.filter((g,i)=>g!==old[i]).length:points.length});
  if(stable)break;
  const prev=cs.map(p=>({...p}));cs=cs.map((c,j)=>{const members=points.filter((_,i)=>assign[i]===j);return members.length?{x:members.reduce((s,p)=>s+p.x,0)/members.length,y:members.reduce((s,p)=>s+p.y,0)/members.length}:{...c};});
  history.push({phase:'update',centers:cs.map(p=>({...p})),previous:prev,assign:[...assign],iteration:iter});old=assign;
 }
 return history;
}
function hHistory(points,method='average'){
 let clusters=points.map(p=>({id:p.id,members:[p.id],height:0,left:null,right:null})),states=[{clusters:[...clusters],merge:null}],merges=[],id=points.length;
 function link(a,b){const ds=a.members.flatMap(i=>b.members.map(j=>distance(points[i],points[j])));return method==='single'?Math.min(...ds):method==='complete'?Math.max(...ds):ds.reduce((a,b)=>a+b,0)/ds.length;}
 while(clusters.length>1){let pair=[0,1],best=Infinity;for(let i=0;i<clusters.length;i++)for(let j=i+1;j<clusters.length;j++){const d=link(clusters[i],clusters[j]);if(d<best){best=d;pair=[i,j];}}
  const [i,j]=pair,left=clusters[i],right=clusters[j],node={id:id++,members:[...left.members,...right.members],height:best,left,right};
  clusters=clusters.filter((_,n)=>n!==i&&n!==j);clusters.push(node);merges.push(node);states.push({clusters:[...clusters],merge:node});
 }
 return {states,merges,root:clusters[0]};
}
function cutTree(node,height){return !node.left||node.height<=height?[node]:[...cutTree(node.left,height),...cutTree(node.right,height)];}
const get=id=>document.getElementById(id);
const ns='http://www.w3.org/2000/svg';
function svgNode(tag,attrs={},text){const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!==undefined)el.textContent=text;return el;}
function add(svg,tag,attrs,text){const el=svgNode(tag,attrs,text);svg.append(el);return el;}
function setup(svg){svg.replaceChildren();for(let n=0;n<=100;n+=20){add(svg,'line',{x1:100+n*4,y1:35,x2:100+n*4,y2:435,stroke:'#e2e7e3'});add(svg,'line',{x1:100,y1:435-n*4,x2:500,y2:435-n*4,stroke:'#e2e7e3'});add(svg,'text',{x:100+n*4,y:457,'text-anchor':'middle',fill:'#546573','font-size':12},n);add(svg,'text',{x:88,y:439-n*4,'text-anchor':'end',fill:'#546573','font-size':12},n);}add(svg,'text',{x:300,y:487,'text-anchor':'middle',fill:'#546573','font-size':14},'Feature 1');add(svg,'text',{x:15,y:245,transform:'rotate(-90 15 245)','text-anchor':'middle',fill:'#546573','font-size':14},'Feature 2');}
const xy=p=>({x:100+p.x*4,y:435-p.y*4});
let km=[],ki=0,seed=6,hier=null,hi=0,cutMode=false,timer=null,current='group-it';
function pause(){if(timer)clearInterval(timer);timer=null;get('kplay').textContent='Play';get('hplay').textContent='Play';}
function drawK(){const s=km[ki],svg=get('kplot');setup(svg);
 if(get('lines').checked&&s.assign)kmPoints.forEach((p,i)=>{const a=xy(p),b=xy(s.centers[s.assign[i]]);add(svg,'line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:palette[s.assign[i]],opacity:.24,'stroke-width':1.5});});
 if(s.previous)s.centers.forEach((c,j)=>{const a=xy(s.previous[j]),b=xy(c);add(svg,'circle',{cx:a.x,cy:a.y,r:12,fill:'none',stroke:palette[j],'stroke-dasharray':'3 3',opacity:.6});add(svg,'line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:palette[j],'stroke-width':3});});
 kmPoints.forEach((p,i)=>{const a=xy(p),color=s.assign?palette[s.assign[i]]:'#667b84';const dot=add(svg,'circle',{cx:a.x,cy:a.y,r:7,fill:color,stroke:'white','stroke-width':2});dot.append(svgNode('title',{},'Point '+(i+1)+(s.assign?' · Group '+(s.assign[i]+1):' · Unassigned')));});
 s.centers.forEach((c,j)=>{const a=xy(c);add(svg,'path',{d:`M ${a.x-10} ${a.y} H ${a.x+10} M ${a.x} ${a.y-10} V ${a.y+10}`,stroke:'white','stroke-width':8});add(svg,'path',{d:`M ${a.x-10} ${a.y} H ${a.x+10} M ${a.x} ${a.y-10} V ${a.y+10}`,stroke:palette[j],'stroke-width':4});add(svg,'text',{x:a.x+13,y:a.y-12,fill:palette[j],'font-size':15,'font-weight':700},'C'+(j+1));});
 const text={start:['Initial centers','Each dot is one observation. The crosses are starting group centers.','Predict: which center is closest to each dot?'],assign:['Assign points','Each point joins the group with the nearest center. '+s.changed+' point'+(s.changed===1?'':'s')+' assigned or changed groups.','Predict: where will each center move?'],update:['Update centers','Each center moves to the average position of its group. Dotted circles show its previous position.','Predict: will any points switch groups next?'],done:['Stable groups','Assignments no longer change. These are the final groups for these starting centers.','Explore: change K or try different starting centers.']}[s.phase];
 get('kphase').textContent=text[0];get('kexplain').textContent=text[1];get('kpredict').textContent=text[2];get('kstep').textContent='Step '+(ki+1)+' of '+km.length+(s.iteration?' · Iteration '+s.iteration:'');get('kback').disabled=ki===0;get('knext').disabled=ki===km.length-1;get('kplay').disabled=ki===km.length-1;
 get('klegend').replaceChildren();s.centers.forEach((_,j)=>{const el=document.createElement('span');el.style.color=palette[j];el.textContent='● Group '+(j+1)+(s.assign?' ('+s.assign.filter(g=>g===j).length+' points)':'');get('klegend').append(el);});
}
function newK(randomize=false){pause();if(randomize)seed++;let r=seed;const rand=()=>{r=(r*1664525+1013904223)>>>0;return r/4294967296;};const k=Number(get('kvalue').value),ids=kmPoints.map((_,i)=>i);for(let i=ids.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}km=kHistory(kmPoints,ids.slice(0,k).map(i=>kmPoints[i]));ki=0;drawK();}

function convexHull(ps){const sorted=[...ps].sort((a,b)=>a.x-b.x||a.y-b.y);const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);const lower=[],upper=[];for(const p of sorted){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}for(const p of [...sorted].reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}lower.pop();upper.pop();return lower.concat(upper);}
function groupOutline(svg,points,color,label){const expanded=points.flatMap(p=>Array.from({length:16},(_,i)=>({x:p.x+23*Math.cos(i*Math.PI/8),y:p.y+23*Math.sin(i*Math.PI/8)})));const hull=convexHull(expanded);const shape=add(svg,'polygon',{points:hull.map(p=>p.x+','+p.y).join(' '),fill:color,'fill-opacity':.08,stroke:color,'stroke-width':2,'stroke-opacity':.7,'stroke-linejoin':'round'});shape.append(svgNode('title',{},label));}
function linkageNote(){get('linkageNote').textContent={average:'Average linkage: compare groups using the average distance across all pairs of points between the two groups.',single:'Single linkage: compare groups using the distance between their closest pair of points.',complete:'Complete linkage: compare groups using the distance between their farthest pair of points.'}[get('linkage').value];}

function drawH(){const state=hier.states[hi],svg=get('hplot');setup(svg);const height=Number(get('cut').value),clusters=cutMode?cutTree(hier.root,height):state.clusters,groupMap={};clusters.forEach((g,j)=>g.members.forEach(i=>groupMap[i]=j));
 clusters.forEach((g,i)=>groupOutline(svg,g.members.map(id=>xy(hp[id])),palette[i],"Group: "+g.members.map(id=>hp[id].label).join(", ")));
 hp.forEach(p=>{const a=xy(p),j=groupMap[p.id];add(svg,'circle',{cx:a.x,cy:a.y,r:12,fill:palette[j],stroke:'white','stroke-width':2});add(svg,'text',{x:a.x,y:a.y+4,'text-anchor':'middle',fill:'white','font-size':13,'font-weight':700},p.label);});
 if(state.merge&&!cutMode){const left=state.merge.left.members.map(i=>xy(hp[i])),right=state.merge.right.members.map(i=>xy(hp[i]));const avg=ps=>({x:ps.reduce((s,p)=>s+p.x,0)/ps.length,y:ps.reduce((s,p)=>s+p.y,0)/ps.length}),a=avg(left),b=avg(right);add(svg,'line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#253d45','stroke-width':2,'stroke-dasharray':'6 5'});}
 const tree=get('tree');tree.replaceChildren();const order=[];function leaves(n){if(!n.left)order.push(n.id);else{leaves(n.left);leaves(n.right);}}leaves(hier.root);const positions={};order.forEach((id,j)=>positions[id]=65+j*65);const max=hier.root.height*1.13,ys=h=>430-h/max*370;
 for(let d=0;d<=max;d+=20){add(tree,'line',{x1:45,y1:ys(d),x2:570,y2:ys(d),stroke:'#e2e7e3'});add(tree,'text',{x:38,y:ys(d)+4,'text-anchor':'end','font-size':12,fill:'#546573'},d.toFixed(0));}
 add(tree,'text',{x:16,y:245,transform:'rotate(-90 16 245)','text-anchor':'middle',fill:'#546573','font-size':14},'Merge distance');
 const loc=n=>!n.left?positions[n.id]:(loc(n.left)+loc(n.right))/2;hier.merges.slice(0,cutMode?7:hi).forEach(n=>{const x1=loc(n.left),x2=loc(n.right),y=ys(n.height);const active=!cutMode&&n===state.merge;add(tree,'path',{d:`M ${x1} ${ys(n.left.height)} V ${y} H ${x2} V ${ys(n.right.height)}`,fill:'none',stroke:active?'#b76b20':'#546573','stroke-width':active?4:2.5});});
 order.forEach(id=>{add(tree,'text',{x:positions[id],y:459,'text-anchor':'middle',fill:palette[groupMap[id]],'font-size':17,'font-weight':700},hp[id].label);});
 if(cutMode){add(tree,'line',{x1:45,y1:ys(height),x2:570,y2:ys(height),stroke:'#b44864','stroke-width':3,'stroke-dasharray':'8 5'});add(tree,'text',{x:570,y:ys(height)-8,'text-anchor':'end',fill:'#b44864','font-size':13},'Cut: '+height.toFixed(1));}
 get('hphase').textContent=cutMode?'Cut the tree':hi===0?'Each point starts as its own group':hi===7?'One complete hierarchy':'Merge the closest groups';get('hexplain').textContent=cutMode?'The horizontal line selects '+clusters.length+' groups. Move it up or down to explore.':hi===0?'Eight points begin as eight separate groups.':`Merge ${state.merge.left.members.map(i=>hp[i].label).join(', ')} with ${state.merge.right.members.map(i=>hp[i].label).join(', ')} at distance ${state.merge.height.toFixed(1)}. ${clusters.length} group${clusters.length===1?'':'s'} remain.`;
 get('hpredict').textContent=cutMode?'Discuss: what changes when you choose a different cut height?':hi===7?'Explore: cut the tree to choose a grouping.':'Predict: which two groups will merge next?';get('hstep').textContent=cutMode?'Tree cut · '+clusters.length+' groups':'Merge '+hi+' of 7';get('hback').disabled=hi===0&&!cutMode;get('hnext').disabled=hi===7;get('hplay').disabled=hi===7;get('cutcontrols').hidden=!cutMode;get('hlegend').textContent=clusters.map(g=>'{'+g.members.map(i=>hp[i].label).join(', ')+'}').join('  ');
}
function newH(){pause();linkageNote();hier=hHistory(hp,get('linkage').value);hi=0;cutMode=false;get('cut').max=(hier.root.height*1.1).toFixed(3);get('cut').value=hier.root.height*.5;drawH();}
function next(type){if(type==='k'&&ki<km.length-1){ki++;drawK();}if(type==='h'&&hi<7){cutMode=false;hi++;drawH();}if((type==='k'&&ki===km.length-1)||(type==='h'&&hi===7))pause();}
function play(type){if(timer){pause();return;}get(type+'play').textContent='Pause';timer=setInterval(()=>next(type),1800);}
get('kplot').addEventListener('click',()=>{pause();next('k');});get('kplot').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pause();next('k');}});
get('kvalue').addEventListener('change',()=>newK());get('randomK').addEventListener('click',()=>newK(true));get('lines').addEventListener('change',drawK);get('kback').addEventListener('click',()=>{pause();ki=Math.max(0,ki-1);drawK();});get('knext').addEventListener('click',()=>{pause();next('k');});get('kplay').addEventListener('click',()=>play('k'));get('kreset').addEventListener('click',()=>{pause();ki=0;drawK();});
get('linkage').addEventListener('change',newH);get('hback').addEventListener('click',()=>{pause();if(cutMode)cutMode=false;else hi=Math.max(0,hi-1);drawH();});get('hnext').addEventListener('click',()=>{pause();next('h');});get('hplay').addEventListener('click',()=>play('h'));get('hreset').addEventListener('click',newH);get('cutTree').addEventListener('click',()=>{pause();hi=7;cutMode=true;drawH();});get('cut').addEventListener('input',drawH);
function switchTab(){pause();const hash=location.hash.slice(1);current=['group-it','k-means','hierarchical'].includes(hash)?hash:'group-it';document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===current;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});document.querySelectorAll('[data-page]').forEach(p=>p.hidden=p.dataset.page!==current);}
document.querySelectorAll('[data-tab]').forEach(b=>{b.addEventListener('click',()=>{location.hash=b.dataset.tab;});b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=Array.from(document.querySelectorAll('[data-tab]')),i=tabs.indexOf(b),j=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[j].focus();location.hash=tabs[j].dataset.tab;});});
window.addEventListener('hashchange',switchTab);get('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{get('screenNote').textContent='Fullscreen is unavailable here. You can use your browser’s full-screen option.';}});document.addEventListener('fullscreenchange',()=>get('fullscreen').textContent=document.fullscreenElement?'Exit full screen':'Full screen');
newK();newH();switchTab();
