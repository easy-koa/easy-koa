import { Component } from "@kapp/core";

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