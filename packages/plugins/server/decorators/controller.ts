import { classType, classTypes, pathMeta } from '@easy-koa/shared/constants';
import { isUndefined, isString } from '@easy-koa/shared';

export function Controller (prefix?: string) {
    const path = (isUndefined(prefix) || (isString(prefix) && prefix.trim() === '/') ) ? '' : prefix;
    return function(target: any) {
        Reflect.defineMetadata(classType, classTypes.controller, target);
        Reflect.defineMetadata(pathMeta, path, target);
    }
}