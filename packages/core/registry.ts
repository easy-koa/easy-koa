import { BaseObject } from "@easy-koa/shared"
import { registry } from "@easy-koa/shared/constants"
import { Component } from "./component"

export class Registry {
    public readonly components: Map<any, any> = new Map() // Need to set an accurate type
    public readonly services: Map <any, any> = new Map()

    public install(target: BaseObject): void {
        this.installComponents(target)
        this.installServices(target)
    }

    static searchDependencies(key: string, target: any): any[] {
        const dependencies: any[] = Reflect.getMetadata(key, target)
        return dependencies ? Array.from(dependencies) : []
    }

    static installToTarget(target: any, property: string, instance: any): void {
        if (instance) {
            target[property] = instance
        } else {
            throw new Error(`failed to inject the property in ${target.constructor.name} - ${property}`)
        }
    }

    public installComponents(target: any): void {
        Registry.searchDependencies(registry.component, target)
            .forEach(([property, consturctor]: any) => {
                Registry.installToTarget(target, property, this.getComponent(consturctor))
            })
    }

    public installServices(target: any): void {
        Registry.searchDependencies(registry.service, target)
            .forEach(([property, consturctor]: any) => {
                Registry.installToTarget(target, property, this.getService(consturctor))
            })
    }

    registerComponnet(component: Component): void {
        const key: any = component.name()
        const value: any = component

        if (!Component.isInstance(component)) {
            throw new Error(`failed to register the ${registry.component} - ${key}, beacause it's not a Component`)
        }

        if (this.components.get(key)) {
            throw new Error(`failed to register the duplicated ${registry.component} - ${key}`)
        }

        this.components.set(key, value)
    }

    registerService(s: { new(): BaseObject }, value: BaseObject): void {
        this.services.set(s.name, value)
    }

    public getComponent < T extends Component > (c: new(...args: any[]) => T): T {
        const key: any = c.prototype.name()
        return this.components.get(key)
    }

    public getService<T> (s: { new(): T }): T {
        let instance: any = this.services.get(s.name)

        if (!instance) {
            instance = new s()
            this.registerService(s, instance)
            this.install(instance)
        }

        return instance
    }
}
