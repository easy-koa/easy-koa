export enum classTypes {
    controller = 'controller',
    service = 'service',
    interceptor = 'interceptor',
}

export const classType = 'type';

export const pathMeta = 'path';

export const methodsMeta = 'methods';

export const moduleMeta = 'module';

export enum methodTypes {
    GET = 'GET',
    POST = 'POST'
}

export enum injection {
    service = 'services',
    plugin = 'plugins',
}