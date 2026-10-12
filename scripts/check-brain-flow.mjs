// Run after npm run build. Geometry/layout checks; no browser evidence implied.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TAU,QUARTER,flowRails,flowLabel,flowWeight,brainTransform,projectBrainPoint,corticalAnchors,connectionDock} from '../build/visual/brain-flow.js';

const bytes=readFileSync(new URL('../public/models/folds.bin',import.meta.url));
const packed=new Int16Array(bytes.buffer,bytes.byteOffset+4,(bytes.length-4)/2);
const folds=Float32Array.from(packed,(v,i)=>v/(i%6<3?20000:32767));
const anchors=corticalAnchors(folds);
assert.equal(new Set(anchors.map(p=>p.join(','))).size,4,'Four distinct cortical attachments');
for(const point of anchors){
  assert(Array.from({length:folds.length/6},(_,i)=>i*6).some(i=>point.every((v,k)=>v===folds[i+k])),'Attachment belongs to a real fold');
}

let layouts=0;
for(const width of [230,250,288,300,350,400,542,667]){
  const height=Math.max(270,width/1.05),small=width<=350;
  const boxes=[{x:30,y:40,width:310},{x:730,y:360,width:270},{x:0,y:670,width:310},{x:660,y:small?790:820,width:330}].map((b,i)=>({...b,height:(small?(i>1?56:52):62)/height*1000}));
  const rails=flowRails(boxes);
  for(let angle=-720;angle<=720;angle+=3){
    for(const pitch of [-.55,.18,.65]){
      const yaw=angle*Math.PI/180,weights=boxes.map((_,i)=>flowWeight(yaw,i));
      assert(Math.abs(weights.reduce((a,b)=>a+b)-1)<1e-10,'Continuous crossfade preserves total emphasis');
      const active=((Math.round(yaw/QUARTER)%4)+4)%4;
      assert(weights[active]>=Math.max(...weights)-1e-10,'Featured area follows the orientation');
      const labels=rails.map((rail,i)=>flowLabel(rail,yaw,pitch,weights[i]));
      for(const [i,label] of labels.entries()){
        const context=`${width}px / ${angle}deg / ${pitch}rad / skill ${i}`;
        assert(label.x>=0&&label.y>=0&&label.x+label.width<=1000&&label.y+label.height<=1000,`Within viewport: ${context}`);
        assert(label.height*height/1000>=44,`Minimum touch height: ${context}`);
        for(const other of labels.slice(i+1)){
          assert(label.x+label.width<=other.x||other.x+other.width<=label.x||label.y+label.height<=other.y||other.y+other.height<=label.y,`Labels do not overlap: ${context}`);
        }
        const anchor=projectBrainPoint(anchors[i],brainTransform(yaw,pitch),width/height);
        const repeat=projectBrainPoint(anchors[i],brainTransform(yaw+TAU,pitch),width/height);
        assert(Math.hypot(anchor.x-repeat.x,anchor.y-repeat.y)<.0001,'No jump at the full-turn boundary');
        const dock=connectionDock(anchor,label);
        assert(Number.isFinite(dock.x)&&Number.isFinite(dock.y),'Connection endpoint is finite');
        assert(dock.x>=label.x-.0001&&dock.x<=label.x+label.width+.0001&&dock.y>=label.y-.0001&&dock.y<=label.y+label.height+.0001,'Connection ends on the transformed label');
      }
      layouts++;
    }
  }
  const start=flowLabel(rails[0],0,.18,1),next=flowLabel(rails[0],Math.PI,.18,0);
  assert(Math.abs(start.cx-next.cx)>400,'Labels follow a visible orbit');
  assert(start.scale>next.scale*1.2,'Featured label has more presence');
}
console.log(JSON.stringify({status:'passed',layouts,anchors:anchors.length,widths:[230,250,288,300,350,400,542,667],scope:'Pure geometry and layout calculations; browser validation is separate.'},null,2));
