import { Interceptor } from "./interceptor";

export interface ServerOptions {
    interceptors?: Interceptor[];
    controllers?: any[];
    middlewares?: any[];
    port?: number;
    render?(template: any, data: any): string;
    renderOptions?: any;
}