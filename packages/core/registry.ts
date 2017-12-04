import { BaseObject } from "@kapp/shared/index";
import { registry } from "@kapp/shared/constants";
import { Component } from "./component";


export class Registry {
    public readonly components = new Map();
    public readonly services = new Map();

    public install(target: BaseObject) {
        this.installComponents(target);
        this.installServices(target);
    }

    static searchDependencies(key: string, target: any) {
        const dependencies = Reflect.getMetadata(key, target);
        return dependencies ? Array.from(dependencies): [];
    }

    static installToTarget(target: any, property: string, instance: any) {
        if (instance) {     
            target[property] = instance;
        } else {
            throw new Error(`failed to inject the property in ${target.constructor.name} - ${property}`)
        }
    }
    
    public installComponents(target: any) {
        Registry.searchDependencies(registry.component, target)
            .forEach(([property, consturctor]) => {
                Registry.installToTarget(target, property, this.getComponent(consturctor))
            });
    }

    public installServices(target: any) {
        Registry.searchDependencies(registry.service, target)
            .forEach(([property, consturctor]) => {
                Registry.installToTarget(target, property, this.getService(consturctor))
            });
    }

    registerComponnet(component: Component) {
        const key = component.name();
        const value = component;

        if (!(component instanceof Component)) {
            throw new Error(`failed to register the ${registry.component} - ${key}, beacause it's not a Component`)
        }

        if (this.components.get(key)) {
            throw new Error(`failed to register the duplicated ${registry.component} - ${key}`)
        }

        this.components.set(key, value);
    }

    registerService(key: { new(): BaseObject }, value: BaseObject) {
        this.services.set(key, value);
    }

    public getComponent<T extends Component>(c: new(...args: any[]) => T ): T {
        const key = c.prototype.name();
        return this.components.get(key);
    }


    public getService<T> (s: { new(): T} ): T {
        let instance = this.services.get(s);
        
        if (!instance) {
            instance = new s();
            this.registerService(s, instance);
            this.install(instance);
        }

        return instance;
    }
}