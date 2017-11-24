declare module "log4js"{
    class Logger {
        fatal(msg: any);
        info(msg: any);
        error(msg: any);
        warn(msg: any);
    }

    namespace logger {
        function configure(cfg: any);
        function getLogger(name: string): Logger;
    }

    export = logger
}