export interface IRouters {
    prefix: string;
    routers: IRouter[];
}

export interface IRouter {
    path: string | RegExp;
    methods: string[];
    handle: any;
}