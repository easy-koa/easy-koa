import { InterceptorMapping } from "./interceptor";

export interface ServerContext {
    interceptorMappings: InterceptorMapping[];
    controllers: any[];
    middlewares: any[];
}