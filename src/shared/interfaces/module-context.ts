import { ServerContext } from './server-context';
import { BaseObject } from './base-object';
import { InterceptorItem } from './interceptor';

export interface ModuleContext extends ServerContext {
    plugins?: any[];
}

export interface ModuleOptions extends ServerContext {
    interceptors?: InterceptorItem[];
    plugins?: any[];
}