export declare function interceptor(action: string, {preHandleTime, postHandleTime}: {
    preHandleTime: number;
    postHandleTime: number;
}): {
    type: string;
    action: string;
    payload: {
        preHandle: {
            time: number;
        };
        postHandle: {
            time: number;
        };
    };
};
export declare function controller(action: string, {time, method}: {
    time: number;
    method: string;
}): {
    type: string;
    action: string;
    payload: {
        time: number;
        method: string;
    };
};
export declare function error(action: string, {error, status}: {
    error: Error;
    status: number;
}): {
    type: string;
    action: string;
    payload: {
        status: number;
        stack: string;
        message: string;
    };
};
