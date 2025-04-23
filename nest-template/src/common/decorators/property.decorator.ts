/* eslint-disable ts/no-unsafe-function-type */
import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { isDefined, IsEnum, IsIn, IsOptional, Length, Max, MaxLength, Min, MinLength, ValidateNested, ValidationOptions } from 'class-validator'
import { isArray, isObject } from 'lodash'
import { I18nPath } from 'src/generated/i18n'

function getTypeIsArrayTuple(
  input: Function | [Function] | undefined | string | Record<string, any>,
  isArrayFlag: boolean
): [Function | undefined, boolean] {
  if (!input) {
    return [input as undefined, isArrayFlag]
  }
  if (isArrayFlag) {
    return [input as Function, isArrayFlag]
  }
  const isInputArray = isArray(input)
  const type = isInputArray ? input[0] : input
  return [type as Function, isInputArray]
}

export type PropertyOptions = ApiPropertyOptions & {
  i18n?: I18nPath
}

export function Property(options?: PropertyOptions) {
  options = options ?? {}

  const decorators: PropertyDecorator[] = [ApiProperty(options)]

  const validationOptions: ValidationOptions = {}

  const [type, isArrayFlag] = getTypeIsArrayTuple(options.type, options.isArray ?? false)

  /** 数组 */
  if (isArrayFlag) {
    validationOptions.each = true
  }

  if (
    typeof type === 'function'
    && type.name !== 'Object'
    && type.name !== 'Array'
    && type.name !== 'Number'
    && type.name !== 'String'
    && type.name !== 'Boolean'
    && type.name !== 'BigInt'
  ) {
    decorators.push(
      Type(() => type),
      ValidateNested({ ...validationOptions })
    )
  }

  /** 枚举 */
  if (typeof options.enum === 'function') {
    options.enum = options.enum()
  }
  if (isArray(options.enum)) {
    decorators.push(IsIn(options.enum, { ...validationOptions }))
  }
  else if (typeof options.enum !== 'function' && isObject(options.enum)) {
    decorators.push(IsEnum(options.enum, { ...validationOptions }))
  }

  /** 可选 */
  if (options.required === false) {
    decorators.push(IsOptional({ ...validationOptions }))
  }

  /** 字符串长度 */
  if (isDefined(options.maxLength) && isDefined(options.minLength)) {
    decorators.push(Length(options.maxLength, options.minLength, { ...validationOptions }))
  }
  else if (isDefined(options.maxLength)) {
    decorators.push(MaxLength(options.maxLength, { ...validationOptions }))
  }
  else if (isDefined(options.minLength)) {
    decorators.push(MinLength(options.minLength, { ...validationOptions }))
  }

  /** 数值范围 */
  if (isDefined(options.maximum)) {
    decorators.push(Max(options.maximum, { ...validationOptions }))
  }
  if (isDefined(options.minimum)) {
    decorators.push(Min(options.minimum, { ...validationOptions }))
  }

  return applyDecorators(...decorators)
}
