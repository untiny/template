import { UnprocessableEntityException, ValidationError } from '@nestjs/common'

export class ValidationException extends UnprocessableEntityException {
  constructor(public errors: ValidationError[]) {
    super()
  }
}
