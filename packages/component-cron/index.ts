import { Component } from "@kapp/core/index";

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