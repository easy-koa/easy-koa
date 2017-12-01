import { Interceptor } from "./interceptor";

export interface ServerOptions {
    interceptors?: Interceptor[];
    controllers?: any[];
    middlewares?: any[];
}