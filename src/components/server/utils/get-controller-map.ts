import { IRouters, IRouter } from "../interfaces/index";
import { walkRouters } from "./walk-routers";

export const getControllerMap = function(routers: IRouters[]) {
    let cMap = new Map();

    walkRouters(routers, function(prefix: string, router: IRouter) {
        const { path, controller } = router;
        cMap.set( `${prefix}${path}`, controller );
    })

    return cMap;
}