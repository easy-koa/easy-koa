import 'reflect-metadata';
import { classType, classTypes, pathMeta, injection } from '../constants';
import { isUndefined, isString, isNil } from '../index';


function inject(key: string) {
    return function (service: any) {
        return function(target: any, propertyKey?: string | symbol) {
            let services = Reflect.getMetadata(key, target);
            if (isNil(services)) {
                services = new Map();
                Reflect.defineMetadata(key, services, target);
            }
            
            services.set(propertyKey, service);
        }
    }
}

export const InjectPlugin = inject(injection.plugin);
export const InjectService = inject(injection.service);