declare module "log4js"{
    interface Logger {
        fatal(msg: any): void;
        info(msg: any): void;
        error(msg: any): void;
        warn(msg: any): void;
    }

    export function configure(cfg: any): any;

    export function getLogger(name: string): Logger;
}