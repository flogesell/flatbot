import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '../services/jwt/jwt.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly logger: Logger,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateJwt(request);
  }

  /**
   * get authorization attribute from header and validate azure AD token
   * @param req
   * @returns Promise
   */
  async validateJwt(req: Request): Promise<boolean> {
    return new Promise(async (resolve) => {
      // await this.jwt
      //   .verify(this.jwt.getAuthorization(req), req)
      //   .then((res) => {
      //     if (res.status === 'error') {
      //       this.logger.error(res.message);
      //     } else {
      //       return res;
      //     }
      //   })
      //   .catch((err) => {
      //     this.logger.error(err.message || 'token verification failed');
      //   });

      // EXAMPLE: use resolved jwt to lookup user + roles in db and to verify access

      // if (!(userObj == undefined)) {
      //   req['session'] = userObj;
      //   resolve(true);
      // } else if (req['decoded_token']) {
      //   // TESTING
      //   // console.info(
      //   //   'could not find user but has decoded_token',
      //   //   req['decoded_token']
      //   // );

      //   resolve(true);
      // } else {
      //   this.logger.error('could not decode jwt');
      //   resolve(false);
      // }

      resolve(true);
    });
  }
}
