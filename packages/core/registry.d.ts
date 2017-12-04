import { BaseObject } from "@kapp/shared/index";
import { Component } from "./component";
export declare class Registry {
    readonly components: Map<any, any>;
    readonly services: Map<any, any>;
    install(target: BaseObject): void;
    static searchDependencies(key: string, target: any): {}[];
    static installToTarget(target: any, property: string, instance: any): void;
    installComponents(target: any): void;
    installServices(target: any): void;
    registerComponnet(component: Component): void;
    registerService(key: {
        new (): BaseObject;
    }, value: BaseObject): void;
    getComponent<T extends Component>(c: new (...args: any[]) => T): T;
    getService<T>(s: {
        new (): T;
    }): T;
}
