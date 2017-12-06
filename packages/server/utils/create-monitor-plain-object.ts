import { isUndefined } from "@kapp/shared";

export function interceptor(action: string, {
    preHandleTime, postHandleTime
}: {
    preHandleTime: number, postHandleTime: number,
}) {
    return {
        type: 'interceptor',
        payload: {
            action,
            preHandle: {
                time: preHandleTime
            },
            postHandle: isUndefined(postHandleTime) ? undefined: {
                time: postHandleTime
            },
        }
    }
}

export function controller(payload: {
    action: string, time: number, method: string, status: number
}) {
    return {
        type: 'controller',
        payload
    }
}


export function error( {
    error, status, action
}: { 
    error: Error, status: number, action: string 
}) {
    return {
        type: 'error',
        payload: {
            action,
            status,
            stack: error && error.stack,
            message: error && error.message
        }
    }
}

export function render (payload: {
    action: string, time: number, template: string
}) {
    return {
        type: 'render',
        payload
    }
}