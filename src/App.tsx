import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { BrandIcon, UiIcon } from "./components/BrandIcon";
import { caseUrl, copy, getProjects, links, readBrowserRoute, sectionUrl, type Lang, type Project, type Route, type Section } from "./data";

type Navigate = (route: Route) => void;
const sections: Section[] = ["about", "projects", "journey", "contact"];
// Each brand uses the original Simple Icons paths; Node.js is added to BrandIcon.
// Playwright has no current Simple Icons entry, so it uses a non-brand test symbol.
const skillGroups = [
  { id: "frontend", titles: { es: "Frontend", en: "Frontend" }, skills: [
    { key: "react", label: "React" },
    { key: "nextjs", label: "Next.js" },
    { key: "typescript", label: "TypeScript" },
    { key: "javascript", label: "JavaScript" },
    { key: "tailwind", label: "Tailwind CSS" },
    { key: "vite", label: "Vite" },
  ] },
  { id: "backend", titles: { es: "Backend", en: "Backend" }, skills: [
    { key: "python", label: "Python" },
    { key: "django", label: "Django" },
    { key: "nodejs", label: "Node.js" },
  ] },
  { id: "data", titles: { es: "Datos e infraestructura", en: "Data & infrastructure" }, skills: [
    { key: "postgresql", label: "PostgreSQL" },
    { key: "mysql", label: "MySQL" },
    { key: "docker", label: "Docker" },
    { key: "linux", label: "Linux" },
  ] },
  { id: "quality", titles: { es: "Testing y diseño", en: "Testing & design" }, skills: [
    { key: "playwright", label: "Playwright" },
    { key: "figma", label: "Figma" },
  ] },
] as const;

function Skills({ lang }: { lang: Lang }) {
  const heading = copy[lang].skillsTitle;
  return <section className="about-stack" aria-labelledby="about-stack-title">
    <h2 className="mini-heading" id="about-stack-title">{heading}</h2>
    <div className="about-stack-scroll" role="region" tabIndex={0} aria-label={heading}>
      <div className="skill-groups">
        {skillGroups.map(group => <div className="skill-group" key={group.id}>
          <h3 className="skill-group-name">{group.titles[lang]}</h3>
          <div className="skill-items">
            {group.skills.map(tech => <span className="skill-tag" key={tech.key}>
              {tech.key === "playwright"
                ? <svg className="skill-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5"/><path d="M20 13.5V19H4V5h10"/></svg>
                : <BrandIcon name={tech.key} size={19}/>}
              <span>{tech.label}</span>
            </span>)}
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}

function socialLink(url: string, text: string, icon: "github" | "linkedin") {
  return <a className="social-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={text} title={text} key={text}>
    {icon === "github" ? <BrandIcon name="github" size={22}/> : <UiIcon name="linkedin" size={22}/>}
  </a>;
}

function Sidebar({ route, navigate }: { route: Route; navigate: Navigate }) {
  const c = copy[route.lang];
  const other: Lang = route.lang === "es" ? "en" : "es";
  const otherHref = route.projectId ? caseUrl(other, route.projectId) : sectionUrl(other, route.section);
  return <aside className="sidebar" aria-label={route.lang === "es" ? "Navegación principal" : "Main navigation"}>
    <div className="sidebar-top">
      <a className="identity" href={sectionUrl(route.lang, "about")}
        onClick={e => { if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate({lang:route.lang,section:"about"}); }}
        aria-label="Nelson Sivisstum — Home">
        <span className="identity-name"><span>NELSON</span><span>SIVISSTUM<span className="identity-dot">.</span></span></span>
        <span className="identity-role">{c.role}</span>
      </a>
      <p className="identity-summary">{c.sidebarDescription}</p>
      <nav className="site-nav" aria-label={route.lang === "es" ? "Secciones" : "Sections"}>
        {sections.map(section => <a key={section} className={`nav-link ${route.section === section ? "is-current" : ""}`}
          href={sectionUrl(route.lang, section)} aria-current={route.section === section ? "page" : undefined}
          onClick={e => { if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate({lang:route.lang,section}); }}>
          <span className="nav-name">{c.menu[section]}</span>
        </a>)}
      </nav>
      <a className="mobile-language" href={otherHref} hrefLang={other} aria-label={other === "es" ? "Cambiar a español" : "Switch to English"}>{other.toUpperCase()}</a>
    </div>
    <div className="sidebar-bottom">
      <div className="sidebar-tools">
        <a className="language-link" href={otherHref} hrefLang={other} aria-label={other === "es" ? "Cambiar a español" : "Switch to English"}>
          <UiIcon name="globe" size={17}/>{route.lang.toUpperCase()} <span className="muted">/ {other.toUpperCase()}</span>
        </a>
        <div className="social-links">
          {socialLink(links.github, "GitHub", "github")}
          {socialLink(links.linkedin, "LinkedIn", "linkedin")}
          <a className="social-link" href={`mailto:${links.email}`} aria-label="Email" title="Email"><UiIcon name="mail" size={22}/></a>
        </div>
      </div>
      <span className="sidebar-location">{c.location}</span>
    </div>
  </aside>;
}

function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <header className="page-head"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{intro && <p className="section-intro">{intro}</p>}</header>;
}

function About({ lang, navigate }: { lang: Lang; navigate: Navigate }) {
  const c = copy[lang];
  return <section className="view-body about-view" aria-label={c.menu.about}>
    <span className="eyebrow">{c.kicker}</span>
    <h1>{c.heading}</h1>
    <div className="about-copy"><p>{c.intro}</p><p>{c.intro2}</p><p>{c.intro3}</p></div>
    <div className="about-actions"><a className="action-primary" href={sectionUrl(lang,"projects")} onClick={e=>{if(e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)return;e.preventDefault();navigate({lang,section:"projects"});}}>{c.explore}</a><a className="action-secondary" href={links.cv[lang]} download>{c.download}</a></div>
    <Skills lang={lang}/>
  </section>;
}

function Projects({ lang, navigate }: { lang: Lang; navigate: Navigate }) {
  const c = copy[lang];
  const projects = getProjects(lang);
  return <section className="view-body projects-view" aria-label={c.projectsTitle}>
    <PageHead eyebrow={c.projectsEyebrow} title={c.projectsTitle} intro={c.projectsIntro}/>
    <nav className="projects-list" aria-label={c.projectsTitle}>
      {projects.map(p => <a className="project-row"
        href={caseUrl(lang,p.id)} key={p.id}
        onClick={e=>{if(e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)return;e.preventDefault();navigate({lang,section:"projects",projectId:p.id});}}>
        <div className="project-meta">
          <p className="project-category">{p.category}</p>
          <h2>{p.name}</h2>
          <p className="project-development">{p.development}</p>
          <span className="project-open">{c.open}</span>
        </div>
        <div className="project-inline-preview" aria-hidden="true">
          <img src={p.image} alt="" loading="lazy" decoding="async"/>
        </div>
      </a>)}
    </nav>
  </section>;
}

function Technology({ tech }: {tech: Project["stack"][number]}) {
  return <span className="tech-tag">{tech.label === "Nginx" ? <img className="brand-icon" src="/img/nginx.svg" width="16" height="16" alt="" /> : <BrandIcon name={tech.icon} size={16}/>}<span>{tech.label}</span></span>;
}

function ProjectDetail({ lang, project, navigate }: { lang: Lang; project: Project; navigate: Navigate }) {
  const c = copy[lang];
  const goBack = (e: MouseEvent<HTMLAnchorElement>) => {if(e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)return;e.preventDefault();navigate({lang,section:"projects"});};
  return <article className="view-body project-detail" aria-label={project.name}>
    <a className="back-link" href={sectionUrl(lang,"projects")} onClick={goBack}>{c.back}</a>
    <div className="project-detail-head"><span className="eyebrow">{project.category}</span><h1>{project.name}</h1></div>
    <figure className="detail-media"><img src={project.image} alt={project.imageAlt}/></figure>
    <div className="project-story">
      <section className="story-line"><h2>{c.development}</h2><p>{project.development}</p></section>
      <section className="story-line"><h2>{c.problem}</h2><p>{project.problem}</p></section>
      <section className="story-line"><h2>{c.solution}</h2><p>{project.solution}</p></section>
    </div>
    <div className="project-tech"><h2>{c.technologies}</h2><div className="tech-list">{project.stack.map(t=><Technology key={t.label} tech={t}/>)}</div></div>
    <a className="github-cta" href={project.repo} target="_blank" rel="noopener noreferrer"><BrandIcon name="github" size={19}/>{c.repository}</a>
  </article>;
}

function Journey({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="view-body journey-view" aria-label={c.journeyTitle}>
    <PageHead eyebrow={c.journeyEyebrow} title={c.journeyTitle} intro={c.journeyIntro}/>
    <div className="journey-block"><h2 className="mini-heading">{lang === "es" ? "Recorrido" : "Journey"}</h2>
      <ol className="timeline">{c.timeline.map(item=><li key={item.date}><span className="timeline-time">{item.date}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>)}</ol>
    </div>
    <div className="journey-block"><h2 className="mini-heading">{c.studiesTitle}</h2><div className="studies-list">{c.studies.map(item=><div className="study-row" key={item.name}><time className="study-date" dateTime={item.iso}>{item.date}</time><div className="study-info"><h3>{item.name}</h3><p>{item.info}</p></div></div>)}</div></div>
  </section>;
}

function Contact({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="view-body contact-view" aria-label={c.menu.contact}>
    <span className="eyebrow">{c.contactEyebrow}</span><h1>{c.contactTitle}</h1><p className="contact-lead">{c.contactIntro}</p>
    <a className="contact-main" href={`mailto:${links.email}`}><span>{links.email}</span></a>
    <div className="contact-extra"><a href={links.github} target="_blank" rel="noopener noreferrer"><BrandIcon name="github" size={18}/>{c.contactGithub}</a><a href={links.linkedin} target="_blank" rel="noopener noreferrer"><UiIcon name="linkedin" size={18}/>{c.contactLinkedin}</a><a href={links.cv[lang]} download>{c.contactCv}</a></div>
  </section>;
}

export function App({ initial }: { initial: Route }) {
  const [route, setRoute] = useState<Route>(initial);
  const contentRef = useRef<HTMLDivElement>(null);
  const seenFirstRender = useRef(false);
  const shouldFocus = useRef(false);
  const lang = route.lang;
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const next = readBrowserRoute(window.location.pathname, window.location.hash);
      if (window.location.hash.startsWith("#caso-") && next.projectId) {
        window.history.replaceState(null,"",caseUrl(next.lang,next.projectId));
      }
      setRoute(next);
    };
    sync(); // The hash isn't sent to the server, so apply it after hydration.
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);

  // An unobtrusive purple spotlight; pointer position only, never changes layout.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointer.matches || reducedMotion.matches) return;
    let frame = 0;
    let x = 0, y = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      glow.classList.add("is-visible");
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        glow.style.setProperty("--spot-x", `${x}px`);
        glow.style.setProperty("--spot-y", `${y}px`);
        frame = 0;
      });
    };
    const hide = () => glow.classList.remove("is-visible");
    window.addEventListener("pointermove", move, {passive:true});
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const navigate: Navigate = next => {
    const path = next.projectId ? caseUrl(next.lang,next.projectId) : sectionUrl(next.lang,next.section);
    if (typeof window !== "undefined" && path !== window.location.pathname + window.location.hash) {
      window.history.pushState(null,"",path);
    }
    shouldFocus.current = true;
    setRoute(next);
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>("h1");
    if (shouldFocus.current && target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      shouldFocus.current = false;
    }
    const scroller = el.closest<HTMLElement>(".main-panel");
    scroller?.scrollTo({top:0,behavior:"auto"});
    if (window.matchMedia("(max-width:850px)").matches) window.scrollTo({top:0,behavior:"auto"});
    if (!seenFirstRender.current) {seenFirstRender.current = true;return;}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = gsap.fromTo(el,{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:0.34,ease:"power2.out",clearProps:"all"});
    return () => {animation.kill();gsap.set(el,{clearProps:"all"});};
  }, [route]);

  useEffect(() => {
    const project = route.projectId ? getProjects(route.lang).find(p => p.id === route.projectId) : undefined;
    const title = project ? `${project.name} | Nelson Sivisstum` : route.lang === "es" ? "Nelson Sivisstum | Desarrollador Full Stack Junior" : "Nelson Sivisstum | Junior Full Stack Developer";
    const description = project?.development ?? (route.lang === "es" ? "Portfolio de Nelson Sivisstum: desarrollador Full Stack Junior." : "Nelson Sivisstum's Junior Full Stack Developer portfolio.");
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content",description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content",title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content",description);
    const canonicalUrl = new URL(route.projectId ? caseUrl(route.lang,route.projectId) : sectionUrl(route.lang,"about"),window.location.origin).href;
    const canonical = document.querySelector('link[rel="canonical"]') || Object.assign(document.createElement("link"),{rel:"canonical"});
    canonical.setAttribute("href", canonicalUrl);
    if (!canonical.parentNode) document.head.appendChild(canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content",canonicalUrl);
  },[route]);

  const project = route.projectId ? getProjects(lang).find(p => p.id === route.projectId) : undefined;
  const viewId = project?.id ?? route.section;
  return <div className="shell">
    <a className="skip-link" href="#main">{lang === "es" ? "Saltar al contenido" : "Skip to content"}</a>
    <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    <Sidebar route={route} navigate={navigate}/>
    <main className="main-panel" id="main"><div className="content-stage" ref={contentRef} key={viewId}>
      {project ? <ProjectDetail lang={lang} project={project} navigate={navigate}/> : route.section === "about" ? <About lang={lang} navigate={navigate}/> : route.section === "projects" ? <Projects lang={lang} navigate={navigate}/> : route.section === "journey" ? <Journey lang={lang}/> : <Contact lang={lang}/>}
    </div></main>
  </div>;
}
