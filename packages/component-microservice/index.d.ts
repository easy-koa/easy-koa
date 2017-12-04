import { Component } from '@kapp/core';
import { Monitor } from '@kapp/monitor';
import { Cron } from '@kapp/cron';
export declare class MicroServices extends Component {
    private logger;
    monitor: Monitor;
    cron: Cron;
    private client;
    services: any;
    private microServices;
    name(): string;
    constructor(options: any);
    init(): Promise<void>;
    destroy(): void;
}
