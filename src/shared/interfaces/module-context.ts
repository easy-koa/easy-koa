import { ServerContext } from './server-context';
import { BaseObject } from './base-object';

export interface ModuleContext extends ServerContext {
    plugins?: any[];
}