import 'reflect-metadata';
import { Application } from '@kapp/core/index';
import { ModuleOptions } from './interfaces';
export declare class Kapp {
    readonly application: Application;
    private moduleContext;
    private registerCache;
    constructor(moduleOptions: ModuleOptions);
    private install();
    static create(): Kapp;
    private configure(moduleOptions);
    run(): any;
    private cacheResgiterModule();
    private registerModule();
}
