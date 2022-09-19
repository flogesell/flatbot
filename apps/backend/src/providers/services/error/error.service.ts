import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorService {
  /**
   * Get data from reporting url
   *
   * @param {Object} err - Error object to report
   * @param {Number} status - Optional http status code
   */
  public handle = function (err: Error, status?: number): void {
    let error = err;
    let code = status;
    if (err['error']) {
      error = err['error'];
      if (err['status']) {
        code = err['status'];
      }
    }

    // convert stack trace to string
    const msg = error.message + '';

    throw new HttpException(
      msg,
      code ? code : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
