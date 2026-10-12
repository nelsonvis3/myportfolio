/** Small pointer-driven depth, with no perpetual animation or touch scroll capture. */
export function mountProjectDepth() {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    for (const scene of document.querySelectorAll("[data-project-scene]")) {
        let frame = 0, x = 0, y = 0;
        const reset = () => { cancelAnimationFrame(frame); frame = 0; scene.dataset.tracking = "false"; scene.style.removeProperty("--tilt-x"); scene.style.removeProperty("--tilt-y"); };
        scene.addEventListener("pointermove", event => {
            if (reduced.matches || event.pointerType !== "mouse")
                return;
            const rect = scene.getBoundingClientRect();
            x = (event.clientX - rect.left) / rect.width - .5;
            y = (event.clientY - rect.top) / rect.height - .5;
            if (frame)
                return;
            frame = requestAnimationFrame(() => { frame = 0; scene.dataset.tracking = "true"; scene.style.setProperty("--tilt-x", `${-y * 5}deg`); scene.style.setProperty("--tilt-y", `${x * 7}deg`); });
        }, { passive: true });
        scene.addEventListener("pointerleave", reset);
        scene.addEventListener("blur", reset);
        reduced.addEventListener("change", reset);
    }
}
