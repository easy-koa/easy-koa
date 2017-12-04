import { Component } from "@kapp/core/index";
export declare class Cron extends Component {
    name(): string;
    constructor();
    init(): void;
    setJob(fn: Function, duration: number): void;
}
