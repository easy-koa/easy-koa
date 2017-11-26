function isPromise(obj: any) {
    return !!(obj && obj.then);
}

export function ensurePromise(result: any) {
    if (isPromise(result)) {
        return result;
    }
    return Promise.resolve(result);
}