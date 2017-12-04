import { Component } from '@kapp/core';
import { LoggerOptions } from './interfaces/logger-options';
export declare class Logger extends Component {
    private logger;
    private loggerFactory;
    constructor(name: string, cfg: any);
    create(name: string): any;
    name(): string;
    fatal(message: any): any;
    info(message: any): any;
    error(message: any): any;
    warn(message: any): any;
    destroy(error: any): void;
    static configure({application, options}: LoggerOptions): LoggerOptions;
}
