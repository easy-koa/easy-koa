import 'reflect-metadata';
import { BaseObject, isUndefined, isNil } from "../../shared/index";
import { pathMeta, methodsMeta } from "../../shared/constants";
import { IRouter, IRouters } from "./interfaces/index";
import Router = require('koa-router');

export class RouterExplorer {
    private controller: any;
    private readonly router: Router = new Router();

    constructor(controller: any) {
        this.controller = controller;
    }

    public expore(): IRouters {
        const { controller } = this;
        const Controller = controller.constructor;
        const path = Reflect.getMetadata(pathMeta, Controller);
        const ctx = controller;
    
        const instancePrototype = Object.getPrototypeOf(ctx);

        const routers: IRouter[] = Object.getOwnPropertyNames(
            instancePrototype
        ).filter(item =>
            item !== 'constructor'
        ).map(item =>
            instancePrototype[item]
        ).reduce((routers: any, handle: Function) => {
            const path = Reflect.getMetadata(pathMeta, handle);
            const methodTypes = Reflect.getMetadata(methodsMeta, handle);
        
            if ( !isUndefined(methodTypes) && !isUndefined(path) ) {
                routers.push({
                    methods: methodTypes,
                    path,
                    handle: handle.bind(ctx)
                });
            }

            return routers;
        }, []);

        return {
            prefix: path,
            routers: routers
        };
    }

    private create() {
        const { prefix, routers }: IRouters = this.expore();

        routers.forEach(({ path, handle, methods }: IRouter) => {
            this.router.register(path, methods, handle);
        })

        console.log(`register routes: prefix - ${prefix}, routers - ${JSON.stringify(routers)}`);
        
        return { prefix, router: this.router }
    }

    static create(controller: any) {
        return new RouterExplorer(controller).create();
    }
}


export class RoutersExplorer{
    static createRouters(Controllers: any) {
        const compose = new Router();
        Controllers.forEach((controller: any) => {
            if (isNil(controller)) {
                return;
            }

            const { prefix, router } = RouterExplorer.create(controller)
            
            compose.use(
                prefix,
                router.routes(),
                router.allowedMethods()
            )
        });
        return compose;
    }
}