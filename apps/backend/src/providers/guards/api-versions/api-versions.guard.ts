import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiVersionGuard implements CanActivate {
  private maxVersion = 2;

  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest();
    // Express or Fastify
    const url = (request.url as string) || (request.raw.url as string);
    const versions = this.reflector.get<string[]>(
      'apiVersion',
      ctx.getHandler(),
    );

    if (!versions || !versions.length) {
      if (
        url.indexOf('/api/v') > -1 &&
        parseInt(url.split('/api/v')[1].split('/')[0]) > this.maxVersion
      ) {
        return false;
      }
      return true;
    }

    return versions.some((version) => url.indexOf('/api/' + version) === 0);
  }
}
