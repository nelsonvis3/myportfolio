// Exporta fuentes editables a PDF A4 mediante Chromium/CDP, sin dependencias npm nuevas.
// node tools/render-career-documents.mjs [--company="Empresa" --role="Puesto" --reason="Motivo real"]
import {spawn,spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,copyFileSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {tmpdir,homedir} from 'node:os';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(readFileSync(join(root,'docs/cv/content.json'),'utf8'));
const out=process.env.CAREER_OUTPUT_DIR||join(homedir(),'Imágenes/Curriculum');
const preview=join(root,'docs/cv/generated');mkdirSync(out,{recursive:true});mkdirSync(preview,{recursive:true});
const cvOnly=process.argv.includes('--cv-only');
const options=Object.fromEntries(process.argv.slice(2).filter(a=>a!=='--cv-only').map(a=>{const i=a.indexOf('=');return [a.slice(2,i),a.slice(i+1)];}));
if(Object.keys(options).length && (!options.company||!options.role||!options.reason))throw new Error('La carta dirigida requiere company, role y reason reales.');
const esc=s=>String(s).replace(/[&<>"']/g,c=>`&#${c.charCodeAt(0)};`);
const link=(url,label)=>`<a href="${esc(url)}">${esc(label)}</a>`;
const css=`@page{size:A4;margin:13mm 16mm}*{box-sizing:border-box}body{margin:0;color:#172033;font:10pt/1.3 Arial,Helvetica,sans-serif}h1,h2,h3,p{margin:0}h1{font-size:23pt;letter-spacing:-.6pt}h2{font-size:10pt;text-transform:uppercase;letter-spacing:.6pt;color:#164c74;border-bottom:1px solid #cdd7df;padding-bottom:3pt;margin:11pt 0 5pt}h3{font-size:10.5pt;margin-top:6pt}a{color:#174d77;text-decoration:none}header{padding-bottom:4pt}.role{font-size:12pt;margin:3pt 0 6pt;color:#164c74}.contact{font-size:8.7pt;line-height:1.5}.profile-links strong{color:#000;font-weight:700}.profile-links a{color:#174d77;font-weight:400}.profile-links{display:block}.skills p{margin:2pt 0}.context,.stack,.repo{font-size:8.7pt;line-height:1.35}.context{color:#475569;margin:2pt 0}.stack{margin-top:2pt}.repo{margin:2pt 0}ul{padding-left:14pt;margin:3pt 0 0}li{padding-left:1pt;margin:3pt 0}article{break-inside:avoid}article+article{margin-top:11pt}.education p{font-size:9pt;margin:3pt 0}.letter{font-size:11pt;line-height:1.55}.letter main{margin-top:24pt}.letter main p{margin:0 0 13pt}.letter .signature{font-weight:bold}.letter footer{margin-top:22pt;color:#475569;font-size:9pt}`;
const visibleUrl=url=>url.replace(/^https?:\/\/(www\.)?/, '');
function header(lang,role){const t=data[lang];return `<header><h1>${esc(data.name)}</h1><p class="role">${esc(role)}</p><p class="contact">${esc(data.location)} · ${esc(t.remote)} · ${esc(data.phone)} · ${link('mailto:'+data.email,data.email)}<span class="profile-links"><strong>GitHub:</strong> ${link(data.github,visibleUrl(data.github))} · <strong>LinkedIn:</strong> ${link(data.linkedin,visibleUrl(data.linkedin))}</span><span class="profile-links"><strong>Portfolio:</strong> ${link(data.website,visibleUrl(data.website))}</span></p></header>`;}
function resume(lang){const t=data[lang];const order=['fracxion','ragnar','roadledger'];return header(lang,t.role)+`<main><section><h2>${esc(t.summaryLabel)}</h2><p>${esc(t.summary)}</p></section><section class="skills"><h2>${esc(t.skillsLabel)}</h2>${t.skills.map(([a,b])=>`<p><strong>${esc(a)}:</strong> ${esc(b)}</p>`).join('')}</section><section><h2>${esc(t.projectsLabel)}</h2>${order.map(id=>{const p=t.projects[id];return `<article><h3>${esc(p.title)}</h3><p class="context">${esc(p.context)}</p><p class="repo">${link('https://github.com/nelsonvis3/'+p.repo,'github.com/nelsonvis3/'+p.repo)}</p><ul>${p.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></article>`;}).join('')}</section><section class="education"><h2>${esc(t.educationLabel)}</h2>${t.education.map(([a,b])=>`<p><strong>${esc(a)}</strong> — ${esc(b)}</p>`).join('')}${data.formalEducation?`<p>${esc(data.formalEducation[lang])}</p>`:''}</section><section><h2>${esc(t.languagesLabel)}</h2><p>${esc(t.languages)}</p></section></main>`;}
function letter(lang,short){const t=data[lang];let paragraphs=[...(short?t.shortLetter:t.letter)];if(options.company){paragraphs[1]=(lang==='es'?`Me postulo al puesto de ${options.role} en ${options.company}. `:`I'm applying for the ${options.role} role at ${options.company}. `)+options.reason;}return header(lang,t.role)+`<main>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="signature">${esc(data.name)}</p></main>`;}
const jobs=[];
for(const lang of ['es','en'])jobs.push({lang,file:`CV_Nelson_Sivisstum_${lang.toUpperCase()}.pdf`,title:`${data.name} — ${data[lang].role}`,body:resume(lang),publicFile:lang==='es'?'cv.pdf':'cv-en.pdf'});
if(!cvOnly)for(const lang of ['es','en'])jobs.push({lang,file:`Cover_Letter_Nelson_Sivisstum_${lang.toUpperCase()}.pdf`,title:`${data.name} — ${lang==='es'?'Carta de presentación':'Cover letter'}`,body:letter(lang,false),letter:true});
if(!cvOnly)jobs.push({lang:'en',file:'Cover_Letter_Nelson_Sivisstum_EN1.pdf',title:`${data.name} — Short cover letter`,body:letter('en',true),letter:true});
const profile=mkdtempSync(join(tmpdir(),'career-documents-'));const port=9600+Math.floor(Math.random()*300);
const child=spawn(process.env.CAREER_BROWSER||'/usr/bin/brave',['--headless=new','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));let ws;
try{
 let targets;for(let i=0;i<60&&!targets;i++){try{targets=await(await fetch(`http://127.0.0.1:${port}/json`)).json();}catch{await delay(150);}}
 if(!targets)throw new Error('No se pudo iniciar Chromium para exportar los documentos.');
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(!m.id)return;const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(new Error(`Timeout: ${method}`));},15000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}));});
 await send('Page.enable');
 const validated=[];
 for(const job of jobs){
  const html=join(preview,job.file.replace('.pdf','.html'));writeFileSync(html,`<!doctype html><html lang="${job.lang}"><head><meta charset="utf-8"><title>${esc(job.title)}</title><style>${css}</style></head><body class="${job.letter?'letter':'resume'}">${job.body}</body></html>`);
  await send('Page.navigate',{url:pathToFileURL(html).href});await delay(150);
  await send('Runtime.evaluate',{expression:'document.fonts.ready',awaitPromise:true});
  const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,generateTaggedPDF:true,displayHeaderFooter:false});
  const temporary=join(profile,job.file);writeFileSync(temporary,Buffer.from(pdf.data,'base64'));
  const info=spawnSync('pdfinfo',[temporary],{encoding:'utf8'});
  if(info.status!==0||!/^Pages:\s+1\s*$/m.test(info.stdout))throw new Error(`${job.file}: la exportación debe tener exactamente una página.`);
  validated.push({job,temporary});
 }
 // Publicar solo cuando todos los documentos hayan pasado el control de una página.
 for(const {job,temporary} of validated){
  const file=join(out,job.file);copyFileSync(temporary,file);
  if(job.publicFile&&!options.company)copyFileSync(file,join(root,'public',job.publicFile));
  console.log(file);
 }
}finally{ws?.close();child.kill();await delay(200);rmSync(profile,{recursive:true,force:true});}
