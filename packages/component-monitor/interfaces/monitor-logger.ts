export interface MonitorLogger {
    info(payload: any): void
    error(payload: any): void
}