import { Component } from './component';
import { BaseObject } from '../shared/interfaces/index';

export class Registry {
    registry: Map<any, any> = new Map()

    all() {
        return this;
    }

    register(name: any, stuff: BaseObject) {
        this.registry.set(name, stuff);
    }

    unregister(name: any) {
        this.registry.delete(name);
    }

    lookup(name: any) {
        return this.registry.get(name); 
    }

    keys() {
        return this.registry.keys(); 
    }

    values() {
        return this.registry.values(); 
    }

    size() {
        return this.registry.size; 
    }

    static create(...args: any[]) {
        return new this(...args)
    }
}