declare module "@kaola/ping"{
    class PollingOptions {
        url?: string;
        retry: number;
        success();
        failed(e: string);
    }
    
    namespace ping {
        function polling(host: string, options: PollingOptions);
    }

    export = ping;
}