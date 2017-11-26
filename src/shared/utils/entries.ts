import { BaseObject } from "../interfaces/index";


export function entries(obj: BaseObject) {
    return Object.keys(obj).map((item: string) => [
        item, obj[item]
    ])
}