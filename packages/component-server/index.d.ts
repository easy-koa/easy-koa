declare module 'koa' {
    interface BaseContext {
        monitor: Monitor;
    }
    interface Context {
        monitor: Monitor;
        controller: string;
    }
}
import 'reflect-metadata';
import { Component } from '@kapp/core/component';
import * as Koa from 'koa';
import { ServerOptions, ServerContext } from './interfaces';
import { Logger } from '@kapp/logger';
import { Monitor } from '@kapp/monitor';
export declare class Server extends Component {
    readonly application: Koa;
    $options: ServerContext;
    logger: Logger;
    monitor: Monitor;
    name(): string;
    constructor(serverContext: ServerContext);
    init(): Promise<void>;
    ready(): Promise<void>;
    private install();
    destroy(): void;
    static configure(options: ServerOptions): ServerContext;
}
