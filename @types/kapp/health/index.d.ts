declare module '@kaola/health' {
    interface operations{
        active();
        shutdown();
    }

    function health(): operations;

    export = health;
}