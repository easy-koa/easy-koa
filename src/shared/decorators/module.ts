import 'reflect-metadata';
import { moduleMeta } from '../constants';


export function Module (options: any) {
    return function(target: any) {
        Reflect.defineMetadata(moduleMeta, options, target);
    }
}