import { Component } from "../../core/index";
import { InjectPlugin } from "../../shared/decorators/injection";
import { Logger } from "../logger";
import { MonitorOptions } from "./interfaces/index";
import * as Koa from 'koa'; 
import { BaseObject } from "../../shared/index";
import { setInterval } from "timers";

declare module 'koa' {
    interface Context {
        collect: Function;
    }
}

export class Monitor extends Component {
    @InjectPlugin(Logger)
    private server: Logger;

    private traceMap = new Map()

    name() {
        return 'monitor';
    }

    constructor(...args: any[]) {
        super();
        this.write();
    }

    collect(ctx: Koa.Context, info: BaseObject) {
        let traces = this.traceMap.get(ctx);
        
        if (!traces) {
            traces = [];
            this.traceMap.set(ctx, traces);
        }

        traces.push(info);
    }

    write() {
        // process.nextTick(() => {
        //     this.traceMap

        //     this.write();
        // })
    } 

    async init() {
        // const {
        //     controllers,
        //     interceptorMappings
        // } = this.server.$options;
    }

    static configure(options: MonitorOptions) {
        return {};
    }
}