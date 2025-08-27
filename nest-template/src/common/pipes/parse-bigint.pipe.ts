import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isNumberString } from 'class-validator'
import { ClsService } from 'nestjs-cls'
import { formatValidationMethodErrorMessage } from '../utils'

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  constructor(private readonly cls: ClsService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (typeof value === 'bigint') return value
    if (!isNumberString(value, { no_symbols: true })) {
      const message = formatValidationMethodErrorMessage('isNumberString', `${metadata.data}`, this.cls.get('language'))
      throw new BadRequestException(message)
    }
    return BigInt(value)
  }
}
