// Only the homepage arms the introduction; ordinary HTML stays usable without JS.
export function introBootstrap(): string {
  return `<script>(function(){try{if(location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches||((navigator.connection||{}).saveData))return;if(sessionStorage.getItem('portfolio:intro:v1')&&new URLSearchParams(location.search).get('intro')!=='1')return;document.documentElement.classList.add('intro-active');window.__portfolioIntro={timer:setTimeout(function(){var s=window.__portfolioIntro;if(s&&s.finish){s.finish(false);return;}document.documentElement.classList.remove('intro-active');var o=document.getElementById('portfolio-intro');if(o)o.remove();document.querySelectorAll('[data-intro-inert]').forEach(function(e){e.inert=false;e.removeAttribute('aria-hidden');});},6500)};}catch(e){document.documentElement.classList.remove('intro-active');}})();</script>`;
}

export function introMarkup(): string {
  return `<div id="portfolio-intro" class="portfolio-intro" role="dialog" aria-modal="true" aria-labelledby="intro-title"><h2 id="intro-title" class="sr-only">Presentación de Nelson Sivisstum</h2><div class="intro-fallback" aria-hidden="true"><span>n<span>s</span></span><p>NELSON SIVISSTUM</p></div><div class="intro-player" data-intro-host aria-hidden="true"></div><button type="button" class="intro-skip" data-intro-skip>Omitir introducción <span aria-hidden="true">↗</span></button></div>`;
}
