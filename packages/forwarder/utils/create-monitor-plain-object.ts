import { isUndefined } from "@kapp/shared";

export function forward(payload: {
    time: number,
    status: number,
    action: string
}) {
    return {
        type: 'forwarder',
        
        payload
    }
}