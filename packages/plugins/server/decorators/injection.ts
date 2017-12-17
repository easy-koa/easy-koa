import { classType, classTypes, pathMeta, registry } from '@one-koa/shared/constants';
import { isUndefined, isString, isNil } from '@one-koa/shared';


function inject(key: string) {
    return function (constructor: any) {
        if (isNil(constructor)) {
            throw new Error('请确保注入操作传入和非空的类');
        }

        return function(target: any, propertyKey?: string | symbol) {
            
            let services = Reflect.getMetadata(key, target);
            if (isNil(services)) {
                services = new Map();
                Reflect.defineMetadata(key, services, target);
            }
            
            services.set(propertyKey, constructor);
        }
    }
}

export const InjectPlugin = inject(registry.component);
export const InjectService = inject(registry.service);