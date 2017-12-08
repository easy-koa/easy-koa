export function startTime(): Function {
    const time: number = Date.now()
    return function end(): number {
        return Date.now() - time
    }
}
