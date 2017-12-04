import { isUndefined } from "../../../shared/index";

export function interceptor(action: string, {
    preHandleTime, postHandleTime
}: {
    preHandleTime: number, postHandleTime: number,
}) {
    return {
        type: 'interceptor',
        action: action,
        payload: {
            preHandle: {
                time: preHandleTime
            },
            postHandle: isUndefined(postHandleTime) ? undefined: {
                time: Date.now() - postHandleTime
            },
        }
    }
}

export function controller(action: string, {
    time, method
}: {
    time: number, method: string
}) {
    return {
        type: 'controller',
        action,
        payload: {
            time, method
        }
    }
}


export function error(action: string, { error, status }: { error: Error, status: number }) {
    return {
        type: 'error',
        action,
        payload: {
            status,
            stack: error && error.stack,
            message: error && error.message
        }
    }
}