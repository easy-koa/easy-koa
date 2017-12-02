import { IRouters, IRouter } from "../interfaces/index";
import { walkRouters } from "./walk-routers";

export function logController(logger: any, routers: IRouters[]) {
    walkRouters(routers, function(prefix: string, router: IRouter) {
        const { path, methods } = router;
        logger.info(`Registered: path - ${prefix}${path}, methods - ${methods.join(',')} `)
    })
}
