import { isUndefined } from "@kapp/shared";

export function forward(url: string, {
    time
}: {
    time: number
}) {
    return {
        type: 'forwarder',
        action: url,
        payload: {
            time
        }
    }
}
