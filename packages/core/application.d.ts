import 'reflect-metadata';
import { Registry } from './registry';
import { Component } from './index';
export declare class Application {
    readonly registry: Registry;
    use(component: Component): void;
    start(): Promise<never>;
    ready(): Promise<void>;
    stop(error?: any): Promise<never>;
    static create(): Application;
}
