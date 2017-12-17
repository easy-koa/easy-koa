import { pathMeta, methodsMeta, methodTypes } from '@easy-koa/shared/constants';

export function RequestMapping ({
    path = '/', methods = [
        methodTypes.GET,
        methodTypes.POST
    ]
}: {
    path?: string,
    methods?: string[]
}) {
    return function(target: any, property: any, descriptor: any) {
        Reflect.defineMetadata(pathMeta, path, descriptor.value);
        Reflect.defineMetadata(methodsMeta, methods, descriptor.value);
    }
}