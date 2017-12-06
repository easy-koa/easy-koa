export function startTime() {
    const time = Date.now();
    return function end() {
        return Date.now() - time;
    }
}