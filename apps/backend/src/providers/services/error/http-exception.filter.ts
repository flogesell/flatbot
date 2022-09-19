import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): string {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;
    let message;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      if (
        status === 404 &&
        message['message'] &&
        message['message'].indexOf('/v') === -1
      ) {
        message =
          message['message'] +
          ' try requesting with route prefix /v1 for example';
      }
    } else {
      status = 500;
      message = 'Internal error';
    }
    return response.status(status).json({
      status,
      time: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
