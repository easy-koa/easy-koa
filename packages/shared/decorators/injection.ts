import { classType, classTypes, pathMeta, registry } from '../constants'
import { isUndefined, isString, isNil } from '../index'


function inject(key: string): Function {
    return function (constructor: any): Function {
        if (isNil(constructor)) {
            throw new Error('请确保注入操作传入非空的类')
        }

        return function(target: any, propertyKey?: string | symbol): void {
            let services: Map<string, any> = Reflect.getMetadata(key, target)
            if (isNil(services)) {
                services = new Map()
            }
            services.set(<string> propertyKey, constructor)
            Reflect.defineMetadata(key, services, target)
        }
    }
}

export const InjectPlugin: Function = inject(registry.component)
export const InjectService: Function = inject(registry.service)