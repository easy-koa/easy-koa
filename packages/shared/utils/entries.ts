import { BaseObject } from "../interfaces/base-object"

export function entries(object: BaseObject): any[] {
    return Object.keys(object).map((key: any) => {
        return [
            key, object[key],
        ]
    })
}
