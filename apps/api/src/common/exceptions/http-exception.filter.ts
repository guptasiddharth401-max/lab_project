import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    // Log error for audit trail
    if (status >= 400) {
      this.logger.warn(`HTTP ${status}: ${JSON.stringify(message)}`);
    }

    response.status(status).json({
      success: false,
      error: typeof message === 'string' ? message : (message as any)?.message || 'Internal server error',
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
