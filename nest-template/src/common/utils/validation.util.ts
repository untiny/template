import { Logger, ValidationError } from '@nestjs/common'
import { getMetadataStorage, ValidationArguments } from 'class-validator'
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata'
import { uniq } from 'lodash'
import { getValidationBuildMessage, ValidationMessageArguments, ValidationMethod } from '../constants/validation-message.constant'
import { Language } from '../enums/language.enum'
import { getPropertyTitle } from './swagger-metadata.util'

function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError,
): ValidationError {
  const constraints = {}
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`
  }
  return { ...error, constraints }
}

function mapChildrenToValidationErrors(
  error: ValidationError,
  parentPath?: string,
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error]
  }
  const validationErrors: ValidationError[] = []
  parentPath = parentPath
    ? `${parentPath}.${error.property}`
    : error.property
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(
        ...mapChildrenToValidationErrors(item, parentPath),
      )
    }
    validationErrors.push(
      prependConstraintsWithParentProp(parentPath, item),
    )
  }
  return validationErrors
}

function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  const messages = validationErrors
    .flatMap(error => mapChildrenToValidationErrors(error))
    .filter(item => !!item.constraints)
    .flatMap(item => Object.values(item.constraints!).filter(item => !!item))
  return uniq(messages)
}

function getValidationMetadata(
  target: object,
  property: string,
) {
  const storage = getMetadataStorage()
  const metadatas = storage
    .getTargetValidationMetadatas(
      target.constructor,
      target.constructor.name,
      true,
      false,
    )

  const result: { [key: string]: ValidationMetadata } = {}
  metadatas.filter(metadata => metadata.propertyName === property).forEach((metadata) => {
    if (metadata.name) {
      result[metadata.name] = metadata
    }
  })
  return result
}

function constraintToString(constraint: unknown): string {
  if (Array.isArray(constraint)) {
    return constraint.join(', ')
  }

  if (typeof constraint === 'symbol') {
    constraint = constraint.description
  }

  return `${constraint}`
}

function replaceMessageSpecialTokens(
  message: string | ((args: ValidationArguments) => string),
  validationArguments: ValidationArguments
): string {
  let messageString: string = ''
  if (typeof message === 'function') {
    messageString = (message as (args: ValidationArguments) => string)(validationArguments)
  }
  else if (typeof message === 'string') {
    messageString = message
  }

  if (messageString && Array.isArray(validationArguments.constraints)) {
    validationArguments.constraints.forEach((constraint, index) => {
      messageString = messageString.replace(
        new RegExp(`\\$constraint${index + 1}`, 'g'),
        constraintToString(constraint)
      )
    })
  }

  if (
    messageString
    && validationArguments.value !== undefined
    && validationArguments.value !== null
    && ['string', 'boolean', 'number'].includes(typeof validationArguments.value)
  ) {
    messageString = messageString.replace(/\$value/g, validationArguments.value as string)
  }
  if (messageString)
    messageString = messageString.replace(/\$property/g, validationArguments.property)
  if (messageString)
    messageString = messageString.replace(/\$target/g, validationArguments.targetName)

  return messageString
}

function formatValidationErrors(validationErrors: ValidationError[], language: Language = Language.ZH) {
  return validationErrors.map((error) => {
    if (error.children && error.children.length > 0) {
      error.children = formatValidationErrors(error.children, language)
    }
    const target = error.target! as object
    const validationMetadata = getValidationMetadata(target, error.property)
    const propertyTitle = getPropertyTitle(target, error.property, language)
    error.property = propertyTitle ?? error.property // 替换错误消息中的属性名称
    error.constraints = error.constraints ?? {}
    for (const key in error.constraints) {
      if (
        error.constraints[key] === '' // dismissDefaultMessages: true
        || error.constraints[key].endsWith(' must be either object or array')
        || error.constraints[key].startsWith('each value in nested property ')
      ) {
        const metadata = validationMetadata[key]
        if (metadata?.constraints) {
          metadata.constraints = metadata.constraints.map((constraint) => {
            // 判断constraint是否为error.target的属性，是则替换为属性名称, 否则返回原字符串
            if (typeof constraint === 'string' && Object.prototype.hasOwnProperty.call(target, constraint)) {
              // 对于自定义验证的时候或许有用
              const propertyTitle = getPropertyTitle(target, error.property, language)
              return propertyTitle ?? constraint
            }
            return constraint
          })
        }
        const args: ValidationMessageArguments = {
          object: error.target as object,
          value: error.value,
          targetName: (error.target as object)?.constructor?.name,
          property: error.property,
          constraints: metadata?.constraints,
          each: metadata?.each ?? false,
        }
        const buildMessage = getValidationBuildMessage(language, key as ValidationMethod)
        if (!buildMessage) {
          Logger.warn(`未找到 ${language}.${key} 的错误消息`, 'ValidationPipe')
          continue
        }
        const message = buildMessage(args) as string
        error.constraints[key] = replaceMessageSpecialTokens(message, args)
      }
    }
    return error
  })
}

export function formatValidationErrorMessage(errors: ValidationError[], language: Language = Language.ZH): string {
  errors = formatValidationErrors(errors, language)
  const formattedErrors = flattenValidationErrors(errors)
  const message = formattedErrors.join('\n') || 'Validation failed'
  return message
}
