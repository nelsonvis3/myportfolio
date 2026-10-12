"""Derive organic fold lines from the bundled, licensed cortical mesh.
Run from the repository root with Python 3 and NumPy. This is an optional
asset preparation step; npm builds and the browser do not require Python.
"""
import numpy as np, struct
from pathlib import Path
raw=Path('scripts/assets/cortex-source.bin').read_bytes()
n,ni=struct.unpack_from('<II',raw); v=np.frombuffer(raw,dtype='<i2',count=n*6,offset=8).reshape(-1,6).astype(float)
v[:,:3]/=20000;v[:,3:]/=32767
tri=np.frombuffer(raw,dtype='<u2',count=ni,offset=8+n*12).reshape(-1,3)
lap=np.zeros((n,3));mass=np.zeros(n);adj=[set() for i in range(n)]
for a,b,c in tri:
 for x,y,z in [(a,b,c),(b,c,a),(c,a,b)]:
  d1=v[y,:3]-v[x,:3];d2=v[z,:3]-v[x,:3]
  weight=np.dot(d1,d2)/max(np.linalg.norm(np.cross(d1,d2)),1e-9)
  lap[y]+=weight*(v[z,:3]-v[y,:3]);lap[z]+=weight*(v[y,:3]-v[z,:3])
  mass[y]+=weight;mass[z]+=weight
  adj[x].add(int(y));adj[x].add(int(z))
curv=np.sum(lap*v[:,3:],axis=1)/np.maximum(mass,.001)
for _ in range(3):curv=np.array([curv[i]*.5+np.mean(curv[list(nb)])*.5 for i,nb in enumerate(adj)])
print('curvature',np.percentile(curv,[0,10,25,50,75,90,100]))
lines=[]
# A single fold boundary creates organic gyri, not parallel slices of the volume.
for level in [0.0002]:
 for tr in tri:
  vals=curv[tr];seg=[]
  for j in range(3):
   k=(j+1)%3
   if (vals[j]<level)==(vals[k]<level):continue
   t=(level-vals[j])/(vals[k]-vals[j]);point=v[tr[j]]*(1-t)+v[tr[k]]*t
   point[:3]+=point[3:]*.008;seg.extend(point)
  if len(seg)==12:lines.extend(seg)
lines=np.array(lines,dtype=np.float32).reshape(-1,6)

# Join triangle intersections into curves and smooth the traces before sampling.
ends={}; connections={}
for i in range(0,len(lines),2):
 a=tuple(np.round(lines[i,:3],5));b=tuple(np.round(lines[i+1,:3],5))
 ends[a]=lines[i];ends[b]=lines[i+1]
 connections.setdefault(a,[]).append(b);connections.setdefault(b,[]).append(a)
visited=set();curves=[]
for origin,neighbors in connections.items():
 for neighbor in neighbors:
  if frozenset((origin,neighbor)) in visited:continue
  path=[origin];previous=origin;current=neighbor
  while True:
   visited.add(frozenset((previous,current)));path.append(current)
   following=[p for p in connections[current] if frozenset((current,p)) not in visited]
   if not following or current==origin:break
   previous,current=current,following[0]
  curve=np.array([ends[p] for p in path]);closed=path[0]==path[-1]
  for _ in range(3):
   smooth=curve.copy();smooth[1:-1]=(curve[:-2]+2*curve[1:-1]+curve[2:])/4
   if closed:smooth[0]=smooth[-1]=(curve[-2]+2*curve[0]+curve[1])/4
   curve=smooth
  # Keep meaningful bends; the threshold is well below a screen pixel.
  selected=[curve[0]]
  for i in range(1,len(curve)-1):
   a=selected[-1][:3];b=curve[i+1,:3];delta=b-a
   distance=np.linalg.norm(np.cross(curve[i,:3]-a,delta))/max(np.linalg.norm(delta),1e-9)
   if distance>.002 or np.linalg.norm(curve[i,:3]-a)>.045:selected.append(curve[i])
  selected.append(curve[-1]);curves.extend([point for pair in zip(selected[:-1],selected[1:]) for point in pair])
lines=np.array(curves)
lines[:,:3]+=lines[:,3:]*.013
packed=np.clip(lines*np.array([20000]*3+[32767]*3),-32767,32767).astype('<i2')
Path('public/models/folds.bin').write_bytes(struct.pack('<I',len(lines))+packed.tobytes())
print('fold vertices',len(lines),'bytes',packed.nbytes+4)

# A lighter mesh is enough for occlusion and the changing silhouette.
_,mapping=np.unique(np.round(v[:,:3]/.065).astype(int),axis=0,return_inverse=True)
count=mapping.max()+1;compact=np.zeros((count,6));mass=np.bincount(mapping)
for component in range(6):np.add.at(compact[:,component],mapping,v[:,component])
compact/=mass[:,None];compact[:,3:]/=np.linalg.norm(compact[:,3:],axis=1)[:,None]
faces=mapping[tri];faces=faces[(faces[:,0]!=faces[:,1])&(faces[:,1]!=faces[:,2])&(faces[:,2]!=faces[:,0])]
packed=np.clip(compact*np.array([20000]*3+[32767]*3),-32767,32767).astype('<i2')
Path('public/models/cortex.bin').write_bytes(struct.pack('<II',count,faces.size)+packed.tobytes()+faces.astype('<u2').tobytes())
print('occlusion vertices',count,'triangles',len(faces))
