// Spatial partitioning for O(n) particle connections instead of O(n²)
function drawConnections() {
    const grid = {};
    // Only check neighboring cells
    for (const key in grid) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                // Check only nearby particles
            }
        }
    }
}

// Debounce and throttle for performance
const debouncedResize = debounce(resizeCanvas, 250);
const throttledMouse = throttle(mouseHandler, 16);

// Stop animation when tab not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else animateHero();
});