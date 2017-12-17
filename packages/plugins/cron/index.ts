import { Component } from "@one-koa/core";

export class Cron extends Component{
    name() {
        return 'cron';
    }
    constructor() {
        super();
    }

    init() {}

    setJob(fn: Function, duration: number) {
        setInterval(function() {
            fn();
        }, duration);
        fn();
    }
}
