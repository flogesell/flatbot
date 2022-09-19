import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envVars } from '../../environment';

@Injectable()
export class GlobalConfigService {
  public env = '.env';
  private namespace = 'src/providers/services/config.service.ts';
  private loggerInst: Logger;
  get logger(): Logger {
    if (!this.loggerInst)
      this.loggerInst = new Logger(GlobalConfigService.name);
    return this.loggerInst;
  }

  constructor(private configService: ConfigService) {
    this.logger.log(`Loaded the config: --> ${this.env}`, this.namespace);
    this.ensureValues(Object.keys(envVars));
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.configService.get(key);
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * API should fail hard, if requested variable is not available in .env.*
   * or ENV variables/secrets from CI pipeline (kubernetes ENV)
   */
  public ensureValues(keys: string[]): void {
    keys.forEach((key) => {
      if (!envVars[key] && !this.getValue(key, true)) {
        const msg =
          'Missing envirnoment variable, check your .env file and gitlab CI vars!';
        if (this.logger) this.logger.error(this.namespace, msg);
        // eslint-disable-next-line no-console
        else console.error('logger is undefined', this.namespace, msg);
        throw new Error(msg);
      }
    });
  }

  public getPort(): string {
    const key = 'APP_PORT';
    return envVars[key] || this.getValue(key, true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getLogModes(): any {
    const key = 'LOG_MODES';
    const values = envVars[key] || this.getValue(key, true);
    const retObj = {};
    if (values)
      values.split(',').forEach((value: string | number) => {
        retObj[value] = true;
      });
    return retObj;
  }
}
