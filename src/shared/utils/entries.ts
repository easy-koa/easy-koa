import BaseObject from "../interfaces/base-object";


export default function entries(obj: BaseObject) {
    return Object.keys(obj).map((item: string) => [
        item, obj[item]
    ])
}