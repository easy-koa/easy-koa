import ServerContext from './server-context';
import BaseObject from './base-object';

export default interface ModuleContext extends ServerContext {
    microServices?: BaseObject;
}