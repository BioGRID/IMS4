// Incorporate a synchronous delay, good for testing workflow of
// some pages. Delay is in milliseconds.
export function syncDelay( delay: number ) {
    const start = Date.now();
    let now = start;
    while (now - start < delay) {
        now = Date.now();
    }
}
