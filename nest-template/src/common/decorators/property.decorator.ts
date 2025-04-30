/* eslint-disable ts/no-unsafe-function-type */
import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsDefined, isDefined, IsEnum, IsIn, IsOptional, Length, Matches, Max, MaxLength, Min, MinLength, ValidateNested, ValidationOptions } from 'class-validator'
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

function isBasicType(type: Function | string): boolean {
  const basicTypes = ['object', 'array', 'string', 'number', 'boolean', 'integer']
  if (typeof type === 'string') {
    return basicTypes.includes(type)
  }
  return basicTypes.includes(type?.name.toLocaleLowerCase())
}

export type PropertyOptions = ApiPropertyOptions & {
  /** i18n 属性转换 */
  i18n?: I18nPath
  enumName?: string
}

/**
 * 模型属性修饰器
 * 1. 支持 class-validator 验证规则
 * 2. 支持 swagger 文档生成
 * 3. 支持 i18n 转换
 * 4. 支持枚举类型验证
 * 5. 支持嵌套对象验证
 * 6. 数组长度验证
 * 7. 字符串长度验证
 * 8. 数值范围验证
 * 9. 正则匹配验证
 */
export function Property(options?: PropertyOptions) {
  options = options ?? {}

  const decorators: PropertyDecorator[] = []

  const validationOptions: ValidationOptions = {}

  const [type, isArrayFlag] = getTypeIsArrayTuple(options.type, options.isArray ?? false)

  if (isArrayFlag) {
    validationOptions.each = true
  }

  /** 嵌套对象 */
  if (typeof type === 'function' && !isBasicType(type)) {
    decorators.push(
      Type(() => type),
      ValidateNested({ ...validationOptions })
    )
  }

  /** 枚举 */
  if (typeof options.enum === 'function') {
    options.enumName = options.enumName ?? options.enum.name
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
    decorators.push(IsOptional())
  }

  /** 非空 */
  if (options.nullable === false) {
    decorators.push(IsDefined())
  }

  /** 字符串长度 */
  if (isDefined(options.maxLength) && isDefined(options.minLength)) {
    decorators.push(Length(options.maxLength, options.minLength, { ...validationOptions }))
  }
  else {
    if (isDefined(options.maxLength)) {
      decorators.push(MaxLength(options.maxLength, { ...validationOptions }))
    }
    if (isDefined(options.minLength)) {
      decorators.push(MinLength(options.minLength, { ...validationOptions }))
    }
  }

  /** 数值范围 */
  if (isDefined(options.maximum)) {
    decorators.push(Max(options.maximum, { ...validationOptions }))
  }
  if (isDefined(options.minimum)) {
    decorators.push(Min(options.minimum, { ...validationOptions }))
  }

  /** 数组长度 */
  if (isDefined(options.maxItems)) {
    decorators.push(ArrayMaxSize(options.maxItems))
  }
  if (isDefined(options.minItems)) {
    decorators.push(ArrayMinSize(options.minItems))
  }

  /** 正则匹配 */
  if (isDefined(options.pattern)) {
    decorators.push(Matches(new RegExp(options.pattern), { ...validationOptions }))
  }

  return applyDecorators(...decorators, ApiProperty(options))
}
