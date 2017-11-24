export function Module (options: any) {
    return function(target: any) {
        Object.assign(target, options);
    }
}