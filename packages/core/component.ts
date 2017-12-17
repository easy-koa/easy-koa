import { createSystemId } from "@easy-koa/shared"
import { BaseObject, Services, InitOptions } from "@easy-koa/shared"

const pid: Function = createSystemId()

interface Options extends BaseObject {
    enable: boolean
}

export abstract class Component {
    get isComponent(): boolean {
        return true
    }

    constructor(...args: any[]) {}
    id: string = pid()

    $options: any = { enable: true }

    abstract name(): string

    init(options: InitOptions): any {}

    ready(): any {}

    destroy(options?: any): any {}

    afterCreated(): any {
        if (typeof this.$options.enable === 'undefined') {
            this.$options.enable = true
        }
    }

    static configure(options: BaseObject): BaseObject {
        return options || {}
    }

    static isInstance(component: any): boolean {
        return component.isComponent === true
    }
}

export interface Components {
    [propName: string]: Component
}
