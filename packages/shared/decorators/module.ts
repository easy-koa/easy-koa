import { moduleMeta } from '../constants'

export function Module(appConfig: any): Function {
    return function(target: any): void {
        Reflect.defineMetadata(moduleMeta, appConfig, target)
    }
}
