export default function createSystemId() {
    // uid
    let currentId = 0;
    return function getNext() {
        return currentId++;
    };
}