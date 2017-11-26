declare module "log4js"{
    interface Logger {
        fatal(msg: any): void;
        info(msg: any): void;
        error(msg: any): void;
        warn(msg: any): void;
    }

    namespace logger {
        function configure(cfg: any): any;
        function getLogger(name: string): Logger;
    }

    export = logger
}