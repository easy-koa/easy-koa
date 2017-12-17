import { Component } from '@one-koa/core';
import { InitOptions, BaseObject, startTime } from '@one-koa/shared';
import * as rpc from '@kaola/rpc';
import { InjectPlugin, entries } from '@one-koa/shared';
import { Logger } from '@one-koa/plugin-logger';
import { Monitor } from '@one-koa/plugin-monitor';
import { Cron } from '@one-koa/plugin-cron';
import { wrapServiceMonitor } from './utils/wrap-service-monitor';

interface Services {
    [propName: string]: BaseObject;
};

export class MicroService extends Component {
    @InjectPlugin(Logger)
    private logger: Logger;

    @InjectPlugin(Monitor)
    monitor: Monitor;

    @InjectPlugin(Cron)
    cron: Cron;

    public services: any;
    private Client: any;
    private client: any;
    
    name() {
        return 'rpc';
    }

    constructor(options: any) {
        super();
        const { providers = {} } = options;

        options.services = providers;
        this.$options = options;
        this.Client = rpc.createClient(this.$options);
    }

    
    async init() {      
        const { services, client }: { services: any, client: any } = await this.Client.connect();
        
        this.client = client;

        this.services = wrapServiceMonitor(services, this.monitor);

        // this.cron.setJob(function() {

        // }, 3000);
    }

    destroy() {
        if (this.client) {
            this.client.close();
            if (this.logger)
                this.logger.info('disconnected zookeeper');    
        }
    }
}