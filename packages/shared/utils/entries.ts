import { BaseObject } from "../interfaces/base-object";

export function entries (object: BaseObject) {
    return Object.keys(object).map(function(key) {
        return [
            key, object[key]
        ]
    })
}