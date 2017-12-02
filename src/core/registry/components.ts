import { Registry } from "./base-registry";
import { Component } from "../index";

export class ComponentsRegistry extends Registry {
    key() {
        return 'component';
    }

    public register(component: any) {
        const constructor = component.constructor;
        if (this.get(constructor)) {
            throw new Error(`failed to register the duplicated ${this.key()} - ${constructor.name}`)
        }
        this.set(constructor.name, component);
    }

    public getInstance(component: any) {
        return this.get(component.name);
    }

}