import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { isNumberString } from 'class-validator'

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  transform(value: string, _: ArgumentMetadata) {
    if (typeof value === 'bigint')
      return value
    if (!isNumberString(value, { no_symbols: true })) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      )
    }
    return BigInt(value)
  }
}
