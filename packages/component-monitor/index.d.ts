import { Component } from "@kapp/core/index";
import { MonitorOptions } from "./interfaces/index";
export declare class Monitor extends Component {
    private cron;
    private logger;
    private monitor;
    private traceMap;
    name(): string;
    constructor(...args: any[]);
    init(): void;
    collect(message: any): void;
    collectError(message: any): void;
    createCollection(payload: any): string;
    static configure(options: MonitorOptions): {};
}
