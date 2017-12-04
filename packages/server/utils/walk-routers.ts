import { IRouters, IRouter } from "../interfaces/index";

export const walkRouters = function(routers: IRouters[], fn: Function) {
    routers.forEach(({ prefix, routers }: { prefix: string, routers: IRouter[] }) =>
        routers.forEach((router) => {
            fn(prefix, router);
        })
    )
}