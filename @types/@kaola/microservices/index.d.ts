declare module '@kaola/rpc' {
    class rpcResult {
        services: any;
        client: any;
    }
    class connectable{
        connect(): Promise<rpcResult>;
    }

    namespace rpc {
        function createClient(options: any): connectable;
    }

    export = rpc;
}