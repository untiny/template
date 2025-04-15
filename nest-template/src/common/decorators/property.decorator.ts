/* eslint-disable ts/no-unsafe-function-type */
import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { isDefined, IsEnum, IsIn, IsOptional, Length, Max, MaxLength, Min, MinLength, ValidateNested, ValidationOptions } from 'class-validator'
import { isArray, isObject } from 'lodash'

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

export type PropertyOptions = Omit<ApiPropertyOptions, 'title'> & {
  'x-i18n-title'?: Record<'zh_CN' | 'en_US', string>
  'title'?: string | Record<'zh_CN' | 'en_US', string>
}

export function Property(options?: PropertyOptions) {
  options = options ?? {}

  if (typeof options.title === 'string') {
    options['x-i18n-title'] = {
      zh_CN: options.title,
      en_US: options.title,
    }
  }
  else if (typeof options.title === 'object') {
    options['x-i18n-title'] = options.title
    options.title = options['x-i18n-title'].zh_CN
  }

  const decorators = [ApiProperty(options as ApiPropertyOptions)]

  const validationOptions: ValidationOptions = {}

  const [type, isArrayFlag] = getTypeIsArrayTuple(options.type, options.isArray ?? false)

  /** 数组 */
  if (isArrayFlag) {
    validationOptions.each = true
  }

  if (typeof type === 'function') {
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
