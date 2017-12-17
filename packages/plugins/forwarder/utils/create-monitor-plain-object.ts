import { isUndefined } from "@one-koa/shared"

export interface ForwardPayload {
    time: number,
    status: number,
    action: string
}

export function forward(payload: ForwardPayload): {type: string, payload: ForwardPayload} {
    return {
        type: 'forwarder',
        payload,
    }
}
