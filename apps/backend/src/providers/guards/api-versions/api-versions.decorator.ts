import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const ApiVersion = (...versions: string[]): CustomDecorator<string> =>
  SetMetadata('apiVersion', versions);
