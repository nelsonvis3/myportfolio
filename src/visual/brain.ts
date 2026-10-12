/** Line drawing of cortical folds and a view-dependent silhouette.
 * Geometry source and license: /models/README.txt and /models/LICENSE-nilearn.txt. */
import { TAU, QUARTER, brainTransform, projectBrainPoint, corticalAnchors, flowWeight, flowRails, flowLabel, connectionDock, type BrainPoint, type FlowRail } from "./brain-flow.js";
interface BrainScene { anchors:BrainPoint[]; draw(yaw:number,pitch:number):void; dispose():void }
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
let cortex:Promise<ArrayBuffer[]>|null=null;
function loadCortex():Promise<ArrayBuffer[]> {
  if(!cortex)cortex=Promise.all(['/models/cortex.bin','/models/folds.bin'].map(url=>fetch(url).then(response=>{
    if(!response.ok)throw new Error('Brain drawing unavailable');return response.arrayBuffer();
  }))).catch(error=>{cortex=null;throw error;});
  return cortex;
}
function createBrain(canvas:HTMLCanvasElement,data:ArrayBuffer,foldData:ArrayBuffer,changed:()=>void,lost:()=>void):BrainScene|null {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return null;
  const header=new DataView(data),count=header.getUint32(0,true),indexCount=header.getUint32(4,true);
  const lineCount=new DataView(foldData).getUint32(0,true);
  if(count>65535||data.byteLength!==8+count*12+indexCount*2||foldData.byteLength!==4+lineCount*12)return null;
  const unpack=(packed:Int16Array)=>Float32Array.from(packed,(value,i)=>value/(i%6<3?20000:32767));
  const vertices=unpack(new Int16Array(data,8,count*6));
  const indices=new Uint16Array(data,8+count*12,indexCount);
  const folds=unpack(new Int16Array(foldData,4,lineCount*6));
  // Adjacent face signs identify the true outline from every rotation.
  const faces=new Float32Array(indexCount*2),facing=new Float32Array(indexCount/3);
  const edgeMap=new Map<number,[number,number,number,number]>();
  for(let i=0;i<indexCount;i+=3){
    const a=indices[i],b=indices[i+1],c=indices[i+2],j=(i/3)*6;
    const ux=vertices[b*6]-vertices[a*6],uy=vertices[b*6+1]-vertices[a*6+1],uz=vertices[b*6+2]-vertices[a*6+2];
    const vx=vertices[c*6]-vertices[a*6],vy=vertices[c*6+1]-vertices[a*6+1],vz=vertices[c*6+2]-vertices[a*6+2];
    faces[j]=uy*vz-uz*vy;faces[j+1]=uz*vx-ux*vz;faces[j+2]=ux*vy-uy*vx;
    for(let k=0;k<3;k++)faces[j+3+k]=(vertices[a*6+k]+vertices[b*6+k]+vertices[c*6+k])/3;
    for(const [start,end]of[[a,b],[b,c],[c,a]]){
      const key=Math.min(start,end)*count+Math.max(start,end),edge=edgeMap.get(key);
      if(edge)edge[3]=i/3;else edgeMap.set(key,[start,end,i/3,-1]);
    }
  }
  const edges=[...edgeMap.values()];edgeMap.clear();
  // Screen-space strips give every stroke a consistent, softly antialiased width.
  const strip=(out:number[],a:ArrayLike<number>,b:ArrayLike<number>)=>{
    for(const [p,q,side]of[[a,b,-1],[a,b,1],[b,a,-2],[a,b,-1],[b,a,-2],[b,a,2]] as const)
      out.push(p[0],p[1],p[2],q[0],q[1],q[2],side);
  };
  const foldStrips:number[]=[];
  for(let i=0;i<folds.length;i+=12)strip(foldStrips,folds.subarray(i,i+3),folds.subarray(i+6,i+9));
  const shaders:WebGLShader[]=[],programs:WebGLProgram[]=[],buffers:WebGLBuffer[]=[];
  const cleanup=()=>{buffers.forEach(b=>gl.deleteBuffer(b));programs.forEach(p=>gl.deleteProgram(p));shaders.forEach(s=>gl.deleteShader(s));};
  const program=(vertex:string,fragment:string)=>{
    const p=gl.createProgram();if(!p)return null;programs.push(p);
    for(const[type,source]of[[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){
      const shader=gl.createShader(type);if(!shader)return null;shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))return null;gl.attachShader(p,shader);
    }
    gl.linkProgram(p);return gl.getProgramParameter(p,gl.LINK_STATUS)?p:null;
  };
  const project=`vec4 project(vec3 p,float aspect){vec3 v=uTransform*p;float z=v.z-3.65;return vec4(v.x*2.8/aspect,v.y*2.8,-z*1.0025-.20025,-z);}`;
  const depth=program(`attribute vec3 aPosition;uniform mat3 uTransform;uniform float uAspect;${project}void main(){gl_Position=project(aPosition,uAspect);}`,`precision mediump float;void main(){gl_FragColor=vec4(0.);}`);
  const ink=program(`
    attribute vec3 aPosition;attribute vec3 aTarget;attribute float aSide;
    uniform mat3 uTransform;uniform vec2 uViewport;uniform float uWidth;
    varying vec3 vLocal;varying float vSide;
    ${project}
    void main(){
      vec4 p=project(aPosition,uViewport.x/uViewport.y),q=project(aTarget,uViewport.x/uViewport.y);
      vec2 delta=(q.xy/q.w-p.xy/p.w)*uViewport;
      vec2 normal=vec2(-delta.y,delta.x)/max(length(delta),.0001);
      p.xy+=normal*sign(aSide)*uWidth/uViewport*p.w;
      gl_Position=p;vLocal=aPosition;vSide=sign(aSide)*(abs(aSide)>1.5?-1.:1.);
    }`, `
    precision highp float;uniform float uTime;varying vec3 vLocal;varying float vSide;
    void main(){
      vec3 tint=mix(vec3(.28,.81,1.),vec3(.74,.58,1.),smoothstep(-.6,.6,vLocal.x));
      float pulse=pow(.5+.5*sin(vLocal.y*4.-vLocal.z*3.-uTime*.7),8.);
      float alpha=(1.-smoothstep(.25,1.,abs(vSide)))*(.76+.24*pulse);
      gl_FragColor=vec4(mix(tint,vec3(.85,.95,1.),pulse*.3),alpha);
    }`);
  if(!depth||!ink){cleanup();return null;}
  const upload=(target:number,values:BufferSource,usage:number)=>{const b=gl.createBuffer();if(!b)throw new Error('Buffer unavailable');buffers.push(b);gl.bindBuffer(target,b);gl.bufferData(target,values,usage);return b;};
  const mesh=upload(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW),elements=upload(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
  const foldsBuffer=upload(gl.ARRAY_BUFFER,new Float32Array(foldStrips),gl.STATIC_DRAW),outlineBuffer=upload(gl.ARRAY_BUFFER,new Float32Array(0),gl.DYNAMIC_DRAW);
  const depthPosition=gl.getAttribLocation(depth,'aPosition'),inkPosition=gl.getAttribLocation(ink,'aPosition'),target=gl.getAttribLocation(ink,'aTarget'),side=gl.getAttribLocation(ink,'aSide');
  const depthMatrix=gl.getUniformLocation(depth,'uTransform'),depthAspect=gl.getUniformLocation(depth,'uAspect');
  const inkMatrix=gl.getUniformLocation(ink,'uTransform'),viewport=gl.getUniformLocation(ink,'uViewport'),width=gl.getUniformLocation(ink,'uWidth'),time=gl.getUniformLocation(ink,'uTime');
  const bindInk=(buffer:WebGLBuffer)=>{
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    for(const[index,size,offset]of[[inkPosition,3,0],[target,3,12],[side,1,24]]){gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,28,offset);}
  };
  let ratio=1;
  const resize=new ResizeObserver(()=>{
    const r=canvas.getBoundingClientRect();ratio=Math.min(devicePixelRatio,1.5);
    const w=Math.max(1,Math.round(r.width*ratio)),h=Math.max(1,Math.round(r.height*ratio));
    if(canvas.width===w&&canvas.height===h)return;canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);changed();
  });resize.observe(canvas);
  const onLost=(event:Event)=>{event.preventDefault();lost();};canvas.addEventListener('webglcontextlost',onLost);
  gl.clearColor(0,0,0,0);
  return {anchors:corticalAnchors(folds),draw(yaw,pitch){
    const matrix=brainTransform(yaw,pitch);
    const eye=[matrix[2]*3.65,matrix[5]*3.65,matrix[8]*3.65];
    for(let i=0;i<facing.length;i++){const k=i*6;facing[i]=faces[k]*(eye[0]-faces[k+3])+faces[k+1]*(eye[1]-faces[k+4])+faces[k+2]*(eye[2]-faces[k+5]);}
    const outline:number[]=[];
    for(const[a,b,left,right]of edges){
      if(right>=0&&facing[left]*facing[right]>=0)continue;
      // Interior gyri have their own smooth traces. Keep the changing outline
      // near the perimeter so tiny hidden creases do not add visual noise.
      const mx=(vertices[a*6]+vertices[b*6])*.5,my=(vertices[a*6+1]+vertices[b*6+1])*.5,mz=(vertices[a*6+2]+vertices[b*6+2])*.5;
      const screenX=matrix[0]*mx+matrix[3]*my+matrix[6]*mz,screenY=matrix[1]*mx+matrix[4]*my+matrix[7]*mz;
      if((screenX/.95)**2+(screenY/.85)**2<.42)continue;
      const p=[0,1,2].map(k=>vertices[a*6+k]+vertices[a*6+k+3]*.006);
      const q=[0,1,2].map(k=>vertices[b*6+k]+vertices[b*6+k+3]*.006);
      strip(outline,p,q);
    }
    // The anatomical mesh only writes depth. Every visible pixel comes from a stroke.
    gl.depthMask(true);gl.colorMask(true,true,true,true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.colorMask(false,false,false,false);
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(depth);
    gl.uniformMatrix3fv(depthMatrix,false,matrix);gl.uniform1f(depthAspect,canvas.width/canvas.height);
    gl.disableVertexAttribArray(target);gl.disableVertexAttribArray(side);gl.enableVertexAttribArray(depthPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER,mesh);gl.vertexAttribPointer(depthPosition,3,gl.FLOAT,false,24,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elements);
    gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);gl.drawElements(gl.TRIANGLES,indexCount,gl.UNSIGNED_SHORT,0);gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.colorMask(true,true,true,true);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(ink);
    gl.uniformMatrix3fv(inkMatrix,false,matrix);gl.uniform2f(viewport,canvas.width,canvas.height);gl.uniform1f(width,2.2*ratio);gl.uniform1f(time,performance.now()/1000);
    bindInk(foldsBuffer);gl.drawArrays(gl.TRIANGLES,0,foldStrips.length/7);
    bindInk(outlineBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(outline),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,outline.length/7);
    gl.depthMask(true);
  },dispose(){resize.disconnect();canvas.removeEventListener('webglcontextlost',onLost);cleanup();}};
}
export function mountSkillBrain(root:HTMLElement):void {
  const viewport=root.querySelector<HTMLElement>(".brain-viewport")!;
  const canvas=root.querySelector<HTMLCanvasElement>("canvas")!;
  const buttons=[...root.querySelectorAll<HTMLButtonElement>("[data-brain-skill]")];
  const panels=[...root.querySelectorAll<HTMLElement>("[data-brain-panel]")];
  const pause=root.querySelector<HTMLButtonElement>("[data-brain-pause]")!;
  const connections=[...root.querySelectorAll<SVGGElement>("[data-brain-connection]")].map(group=>({
    group,paths:[...group.querySelectorAll<SVGPathElement>(".brain-link,.brain-impulse")],
    branch:group.querySelector<SVGPathElement>(".brain-dendrite")!,
    points:[...group.querySelectorAll<SVGCircleElement>("circle")],
    x:Number(group.querySelector("circle")!.getAttribute("cx")),y:Number(group.querySelector("circle")!.getAttribute("cy")),
  }));
  const announcement=root.querySelector<HTMLElement>("[data-brain-announcement]")!;
  const hint=root.querySelector<HTMLElement>("[data-brain-hint]")!;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const connection=(navigator as Navigator & {connection?:EventTarget & {saveData?:boolean}}).connection;
  let scene:BrainScene|null=null,visible=false,paused=false,frame=0,last=0;
  let yaw=0,pitch=.18,targetYaw:number|null=null,active=-1,resumeAt=0;
  let pointer:number|null=null,startX=0,startY=0,lastX=0,lastY=0,dragged=false;
  let rails:FlowRail[]=[],areaWidth=0,areaHeight=0;
  const canAnimate=()=>!reduced.matches&&!connection?.saveData;
  function setActive(index:number,announce=false):void {
    if(index===active)return;active=index;root.dataset.active=String(index);
    buttons.forEach((button,i)=>button.setAttribute("aria-pressed",String(i===index)));
    panels.forEach((panel,i)=>{panel.hidden=i!==index;});
    connections.forEach(({group},i)=>group.classList.toggle("is-active",i===index));
    if(announce)announcement.textContent=panels[index].textContent;
  }
  function updateControls():void {
    pause.hidden=!scene;root.dataset.paused=String(paused||!scene);
    root.dataset.running=String(!!scene&&visible&&!document.hidden&&!paused&&pointer===null);
    pause.querySelector("[data-pause-label]")!.textContent=paused?"Reanudar giro":"Pausar giro";
    pause.querySelector("[data-pause-icon]")!.textContent=paused?"▷":"Ⅱ";
    hint.textContent=scene?"Arrastrá para girar":"Explorá las habilidades";
    viewport.toggleAttribute("data-interactive",!!scene);
  }
  function updateConnections():void {
    if(!rails.length)return;
    const rotation=scene?yaw:0,tilt=scene?pitch:.18;
    const matrix=brainTransform(rotation,tilt);
    connections.forEach(({group,paths,branch,points,x,y},i)=>{
      const weight=scene?flowWeight(yaw,i):Number(i===active);
      const rail=rails[i],label=flowLabel(rail,rotation,tilt,weight),button=buttons[i];
      const tx=(label.cx-rail.box.x-rail.box.width/2)*areaWidth/1000;
      const ty=(label.cy-rail.box.y-rail.box.height/2)*areaHeight/1000;
      button.style.transform=`translate(${tx}px,${ty}px) scale(${label.scale})`;
      button.style.setProperty("--flow",String(weight));
      button.style.zIndex=String(2+Math.round(weight*10));
      group.style.setProperty("--flow",String(weight));
      const anchor=scene?projectBrainPoint(scene.anchors[i],matrix,canvas.width/canvas.height):{x,y,depth:0};
      const {x:ax,y:ay}=anchor,{x:ex,y:ey}=connectionDock(anchor,label);
      const dx=ex-ax,dy=ey-ay,bend=Math.sin(rotation+i*QUARTER)*24;
      const length=Math.hypot(dx,dy)||1,nx=dx/length,ny=dy/length;
      const d=`M${ax} ${ay} C${ax+dx*.38-ny*bend} ${ay+dy*.38+nx*bend} ${ex-dx*.25-ny*bend} ${ey-dy*.25+nx*bend} ${ex} ${ey}`;
      paths.forEach(path=>path.setAttribute("d",d));
      // One clock for the brain, labels, crossfade and traveling signal.
      // Pausing freezes the signal; reverse dragging sends it backwards.
      paths[1].style.strokeDashoffset=String(-(((rotation/TAU*16)%1+1)%1)*100);
      branch.setAttribute("d",`M${ax-nx*30+ny*20} ${ay-ny*30-nx*20} Q${ax-nx*12} ${ay-ny*12} ${ax} ${ay} Q${ax-nx*12} ${ay-ny*12} ${ax-nx*30-ny*20} ${ay-ny*30+nx*20}`);
      points.forEach(point=>{point.setAttribute("cx",String(ax));point.setAttribute("cy",String(ay));});
    });
    root.dataset.rotation=String(Math.round(((yaw%TAU+TAU)%TAU)*180/Math.PI));
  }
  function layoutConnections():void {
    const area=viewport.getBoundingClientRect();if(!area.width||!area.height)return;
    areaWidth=area.width;areaHeight=area.height;
    // Read untransformed dimensions only on resize, never in the render loop.
    rails=flowRails(buttons.map(button=>({x:button.offsetLeft/areaWidth*1000,y:button.offsetTop/areaHeight*1000,width:button.offsetWidth/areaWidth*1000,height:button.offsetHeight/areaHeight*1000})));
    updateConnections();
  }
  function draw(now:number):void {
    frame=0;
    if(scene&&!canAnimate()){configure();return;}
    const delta=last?Math.min((now-last)/1000,.08):0;last=now;
    if(targetYaw!==null){
      yaw+=(targetYaw-yaw)*.17;
      if(Math.abs(targetYaw-yaw)<.001){yaw=targetYaw;targetYaw=null;}
    }else if(scene&&!paused&&pointer===null&&now>=resumeAt)yaw+=delta*TAU/80;
    const index=((Math.round(yaw/QUARTER)%4)+4)%4;
    if(scene)setActive(index);
    scene?.draw(yaw,pitch);viewport.classList.toggle("brain-ready",!!scene);updateConnections();
    if(scene&&visible&&!document.hidden&&((!paused&&pointer===null)||targetYaw!==null))schedule();
  }
  let lastPaint=0;
  function tick(now:number):void {
    if(now-lastPaint>=32){lastPaint=now;draw(now);}else frame=requestAnimationFrame(tick);
  }
  function schedule():void {if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function sync():void {cancelAnimationFrame(frame);frame=0;last=0;updateControls();schedule();}
  let configuration=0;
  async function configure():Promise<void> {
    const version=++configuration;
    scene?.dispose();scene=null;targetYaw=null;viewport.classList.remove("brain-ready");updateConnections();sync();
    if(!canAnimate())return;
    try {
      const mesh=await loadCortex();
      if(version!==configuration||!canAnimate())return;
      scene=createBrain(canvas,mesh[0],mesh[1],sync,()=>{scene?.dispose();scene=null;viewport.classList.remove("brain-ready");sync();});
    } catch { /* The static brain and manual skills remain available. */ }
    sync();
  }
  function choose(index:number):void {
    paused=true;
    const destination=Math.round((yaw-index*QUARTER)/TAU)*TAU+index*QUARTER;
    if(scene)targetYaw=destination;else{yaw=destination;setActive(index,true);}
    // Announce the requested skill once, not on every intermediate animation frame.
    announcement.textContent=panels[index].textContent;sync();
  }
  buttons.forEach((button,i)=>{button.disabled=false;button.addEventListener("click",()=>choose(i));});
  root.addEventListener("focusin",event=>{if(event.target===pause)return;paused=true;updateControls();});
  pause.addEventListener("click",()=>{paused=!paused;targetYaw=null;sync();});
  viewport.addEventListener("keydown",event=>{
    const button=(event.target as Element).closest<HTMLButtonElement>("[data-brain-skill]");
    const current=button?Number(button.dataset.brainSkill):((Math.round(yaw/QUARTER)%4)+4)%4;
    const index=event.key==="ArrowRight"?(current+1)%4:event.key==="ArrowLeft"?(current+3)%4:event.key==="Home"?0:event.key==="End"?3:null;
    if(index!==null){event.preventDefault();choose(index);if(button)buttons[index].focus();}
  });
  viewport.addEventListener("pointerdown",event=>{
    if(!scene||!event.isPrimary||event.button!==0||(event.target as Element).closest("button"))return;
    pointer=event.pointerId;startX=lastX=event.clientX;startY=lastY=event.clientY;dragged=false;targetYaw=null;
    updateControls();
    if(event.pointerType==="mouse"){event.preventDefault();viewport.setPointerCapture(event.pointerId);}
  });
  viewport.addEventListener("pointermove",event=>{
    if(pointer!==event.pointerId||!scene)return;
    const dx=event.clientX-startX,dy=event.clientY-startY;
    if(!dragged){if(Math.hypot(dx,dy)<5)return;if(event.pointerType!=="mouse"&&Math.abs(dy)>Math.abs(dx))return;dragged=true;viewport.setPointerCapture(event.pointerId);viewport.dataset.dragging="true";}
    yaw+=(event.clientX-lastX)*.009;pitch=clamp(pitch+(event.clientY-lastY)*.005,-.55,.65);
    lastX=event.clientX;lastY=event.clientY;schedule();
  });
  const endDrag=(event:PointerEvent)=>{
    if(pointer!==event.pointerId)return;
    pointer=null;viewport.dataset.dragging="false";resumeAt=performance.now()+2000;
    if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
    if(dragged)announcement.textContent=panels[active].textContent;
    sync();
  };
  viewport.addEventListener("pointerup",endDrag);viewport.addEventListener("pointercancel",endDrag);viewport.addEventListener("lostpointercapture",endDrag);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.08}).observe(root);
  document.addEventListener("visibilitychange",sync);reduced.addEventListener("change",configure);connection?.addEventListener("change",configure);
  const connectionLayout=new ResizeObserver(layoutConnections);connectionLayout.observe(viewport);buttons.forEach(button=>connectionLayout.observe(button));
  viewport.tabIndex=0;setActive(0);layoutConnections();configure();
}
