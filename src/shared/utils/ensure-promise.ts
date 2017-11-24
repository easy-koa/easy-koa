function isPromise(obj: any) {
    return !!(obj && obj.then);
}

function ensurePromise(result: any) {
    if (isPromise(result)) {
        return result;
    }
    return Promise.resolve(result);
}

export default ensurePromise;
