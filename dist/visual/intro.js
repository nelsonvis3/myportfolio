export function mountIntro() {
    const overlay = document.querySelector("#portfolio-intro");
    const host = overlay?.querySelector("[data-intro-host]");
    if (!overlay || !host || !document.documentElement.classList.contains("intro-active"))
        return;
    const content = [...document.querySelectorAll(".site-header, main, .site-footer, .skip-link")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const abort = new AbortController();
    let player, finished = false;
    const skip = overlay.querySelector("[data-intro-skip]");
    const previousFocus = document.activeElement;
    const timer = window.__portfolioIntro?.timer;
    content.forEach(element => { element.inert = true; element.setAttribute("aria-hidden", "true"); element.setAttribute("data-intro-inert", ""); });
    skip.focus({ preventScroll: true });
    function release() {
        const restoreFocus = !!overlay?.contains(document.activeElement);
        document.documentElement.classList.remove("intro-active");
        content.forEach(element => { element.inert = false; element.removeAttribute("aria-hidden"); element.removeAttribute("data-intro-inert"); });
        overlay?.remove();
        player?.remove();
        player = undefined;
        if (restoreFocus) {
            const destination = previousFocus instanceof HTMLElement && previousFocus !== document.body ? previousFocus : document.querySelector("#main");
            destination?.focus({ preventScroll: true });
        }
        document.documentElement.dataset.introState = "complete";
    }
    function finish(transition = true) {
        if (finished)
            return;
        finished = true;
        if (timer)
            clearTimeout(timer);
        abort.abort();
        player?.pause();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        reduced.removeEventListener("change", motionChange);
        document.removeEventListener("visibilitychange", visibility);
        try {
            sessionStorage.setItem("portfolio:intro:v1", "complete");
        }
        catch { /* Storage is optional. */ }
        document.documentElement.dataset.introState = "revealing";
        if (transition && !reduced.matches) {
            const reveal = overlay.animate([{ opacity: 1, clipPath: "inset(0 0 0% 0)" }, { opacity: 0, clipPath: "inset(0 0 100% 0)" }], { duration: 650, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" });
            document.querySelector("#main")?.animate([{ opacity: .5, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 800, easing: "ease-out" });
            void reveal.finished.then(release, release);
        }
        else
            release();
    }
    function onKey(event) {
        if (event.key === "Escape")
            finish();
        if (event.key === "Tab") {
            event.preventDefault();
            skip.focus();
        }
    }
    const resize = () => finish(false);
    const motionChange = () => { if (reduced.matches)
        finish(false); };
    const visibility = () => { if (document.hidden)
        finish(false); };
    window.__portfolioIntro = { timer: timer ?? 0, finish };
    skip.addEventListener("click", () => finish());
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", visibility);
    document.documentElement.dataset.introState = "loading";
    async function start() {
        try {
            const script = new Promise((resolve, reject) => {
                if (customElements.get("hyperframes-player")) {
                    resolve();
                    return;
                }
                const element = document.createElement("script");
                element.src = "/intro/vendor/hyperframes-player.js";
                element.onload = () => resolve();
                element.onerror = () => reject(new Error("Intro player unavailable"));
                document.head.appendChild(element);
            });
            const [response] = await Promise.all([fetch("/intro/neural/index.html", { signal: abort.signal }), script]);
            if (!response.ok)
                throw new Error("Intro composition unavailable");
            const html = await response.text();
            if (finished)
                return;
            const source = new DOMParser().parseFromString(html, "text/html");
            const stage = source.querySelector("[data-composition-id]");
            if (!stage)
                throw new Error("Intro stage unavailable");
            stage.dataset.width = String(window.innerWidth);
            stage.dataset.height = String(window.innerHeight);
            const runtime = new URL("/intro/vendor/hyperframes-runtime.js", location.origin).href;
            player = document.createElement("hyperframes-player");
            player.setAttribute("width", String(window.innerWidth));
            player.setAttribute("height", String(window.innerHeight));
            player.setAttribute("muted", "");
            player.setAttribute("disable-click-to-play", "");
            player.setAttribute("assets-loading-ui", "none");
            player.setAttribute("runtime-src", runtime);
            player.addEventListener("ready", () => {
                if (finished || !player)
                    return;
                player.iframeElement.title = "Líneas neuronales · introducción del portfolio";
                player.iframeElement.tabIndex = -1;
                overlay.dataset.ready = "true";
                document.documentElement.dataset.introState = "playing";
                player.play();
            });
            player.addEventListener("ended", () => finish());
            player.addEventListener("error", () => finish(false));
            player.addEventListener("playbackerror", () => finish(false));
            player.setAttribute("srcdoc", "<!doctype html>" + source.documentElement.outerHTML);
            host.appendChild(player);
        }
        catch {
            finish(false);
        }
    }
    void start();
}
