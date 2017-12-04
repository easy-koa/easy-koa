export function start() {
    const time = Date.now();
    return function end() {
        return Date.now() - time;
    }
}