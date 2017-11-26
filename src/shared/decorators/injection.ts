import 'reflect-metadata';
import { classType, classTypes, pathMeta } from '../constants';
import { isUndefined, isString, isNil } from '../index';

const servicesKey = 'services';
export function Injection(service: any) {
    // return Reflect.metadata('services', target);
    return function(target: any, propertyKey?: string | symbol) {
        let services = Reflect.getMetadata(servicesKey, target);
        if (isNil(services)) {
            services = new Map();
            Reflect.defineMetadata(servicesKey, services, target);
        }
        
        services.set(propertyKey, service);
    }
}