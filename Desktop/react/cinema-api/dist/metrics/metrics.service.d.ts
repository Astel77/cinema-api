import * as client from 'prom-client';
export declare class MetricsService {
    readonly registry: client.Registry;
    private readonly httpRequestsTotal;
    private readonly httpRequestDuration;
    constructor();
    recordRequest(method: string, route: string, statusCode: number, durationSeconds: number): void;
    getMetrics(): Promise<string>;
}
