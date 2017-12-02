import { Registry } from "./base-registry";
import { Component } from "../index";

export class ComponentsRegistry extends Registry {
    key() {
        return 'component';
    }

    public register(component: any) {
        const componentName = component.name();
        const constructor = component.constructor;
        if (this.get(constructor)) {
            throw new Error(`failed to register the duplicated ${this.key()} - ${componentName}`)
        }
        this.set(componentName, component);
    }

    public getInstance(component: any) {
        const componentName = component.prototype.name();
        return this.get(componentName);
    }

}