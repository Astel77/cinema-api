import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime.bigint();

    // Route "générique" (ex: /movies/:id) plutôt que l'URL exacte, pour ne
    // pas exploser le nombre de séries de métriques (cardinalité).
    const route = request.route?.path || request.url;

    return next.handle().pipe(
      tap({
        next: () => this.record(request.method, route, response.statusCode, start),
        error: () => this.record(request.method, route, response.statusCode || 500, start),
      }),
    );
  }

  private record(method: string, route: string, statusCode: number, start: bigint) {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    this.metrics.recordRequest(method, route, statusCode, durationSeconds);
  }
}