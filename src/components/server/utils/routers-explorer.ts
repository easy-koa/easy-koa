import 'reflect-metadata';
import { BaseObject, isUndefined, isNil } from "../../../shared/index";
import { pathMeta, methodsMeta } from "../../../shared/constants";
import { IRouter, IRouters } from "../interfaces/index";
import Router = require('koa-router');
import { Context } from 'koa';

export class RouterExplorer {
    private controller: any;
    private readonly router: Router = new Router();

    constructor(controller: any) {
        this.controller = controller;
    }

    public expore(): IRouters {
        const { controller } = this;
        const Controller = controller.constructor;
        const prefix = Reflect.getMetadata(pathMeta, Controller);
        const prototype = Object.getPrototypeOf(controller);
        const name = Controller.name;

        const routers: IRouter[] = Object.getOwnPropertyNames(
            prototype
        ).filter(item =>
            item !== 'constructor'
        ).map(item => [
                item, prototype[item]
            ]
        ).reduce((routers: any, [ method, handle ]) => {
            const path = Reflect.getMetadata(pathMeta, handle);
            const methodTypes = Reflect.getMetadata(methodsMeta, handle);
        
            if ( !isUndefined(methodTypes) && !isUndefined(path) ) {
                routers.push({
                    methods: methodTypes,
                    path,
                    async handle(ctx: Context, next: Function) {
                        ctx.controller = `${name}.${method}`;
                        return handle.call(controller, ctx, next);
                    }
                });
            }

            return routers;
        }, []);

        return {
            prefix: prefix,
            routers: routers
        };
    }

    private create() {
        const { prefix, routers }: IRouters = this.expore();

        routers.forEach(({ path, handle, methods, controller }: IRouter) => {
            this.router.register(path, methods, handle);
        });
        
        return { prefix, router: this.router, raw: routers }
    }
    static create(controller: any) {
        return new RouterExplorer(controller).create();
    }
}


export class RoutersExplorer{
    static createRouters(Controllers: any) {
        const compose = new Router();
        const rawRouters: IRouters[] = [];
        Controllers.forEach((controller: any) => {
            if (isNil(controller)) {
                return;
            }
            const { prefix, router, raw } = RouterExplorer.create(controller);

            rawRouters.push({
                prefix, routers: raw
            });

            compose.use(
                prefix,
                router.routes(),
                router.allowedMethods()
            )
        });
        return {
            router: compose,
            rawRouters
        };
    }
}