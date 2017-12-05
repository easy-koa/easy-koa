import { InterceptorMapping } from "./interceptor";

export interface ServerContext {
    interceptorMappings: InterceptorMapping[];
    controllers: any[];
    middlewares: any[];
    port: number;
    render(template: any, data: any): string;
    renderOptions?: any;
}