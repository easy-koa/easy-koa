import 'reflect-metadata';
import { IRouter, IRouters } from "../interfaces/index";
import Router = require('koa-router');
export declare class RouterExplorer {
    private controller;
    private readonly router;
    constructor(controller: any);
    expore(): IRouters;
    private create();
    static create(controller: any): {
        prefix: string;
        router: Router;
        raw: IRouter[];
    };
}
export declare class RoutersExplorer {
    static createRouters(Controllers: any): {
        router: Router;
        rawRouters: IRouters[];
    };
}
