import { Component } from "../../core/index";
import { InjectPlugin } from "../../shared/decorators/injection";
import { Logger } from "../logger";
import { MonitorOptions } from "./interfaces/index";

export class Monitor extends Component {
    @InjectPlugin(Logger)
    private server: Logger;

    name() {
        return 'monitor';
    }

    constructor(...args: any[]) {
        super();
    }

    async init() {
        const {
            controllers,
            interceptorMappings
        } = this.server.$options;
    }

    static configure(options: MonitorOptions) {
        return {};
    }
}