export function createSystemId(): Function {
    // uid
    let currentId: number = 0
    return function getNext(): number {
        return currentId++
    }
}
