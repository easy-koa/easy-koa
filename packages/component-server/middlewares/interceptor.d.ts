import { Context } from 'koa';
import { InterceptorMapping } from '../interfaces/interceptor';
export declare function interceptorMiddleware(interceptorMapping: InterceptorMapping): (ctx: Context, next: Function) => Promise<any>;
