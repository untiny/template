import { HttpStatus, Logger, UnprocessableEntityException, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import { getMetadataStorage, ValidationArguments } from 'class-validator'
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata'
import { getApiPropertyOptions } from './utils'
import { BuildMessage, ValidationMessage, ValidationMessageOptions } from './validation-message'

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
  return validationErrors
    .flatMap(error => mapChildrenToValidationErrors(error))
    .filter(item => !!item.constraints)
    .flatMap(item => Object.values(item.constraints!).filter(item => !!item))
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

function formatValidationErrors(validationErrors: ValidationError[]) {
  return validationErrors.map((error) => {
    if (error.children && error.children.length > 0) {
      error.children = formatValidationErrors(error.children)
    }
    const target = error.target! as object
    const validationMetadata = getValidationMetadata(target, error.property)
    const propertyOptions = getApiPropertyOptions(target, error.property)
    console.log(propertyOptions)

    error.property = propertyOptions?.title ?? error.property // 替换错误消息中的属性名称
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
              const propertyOptions = getApiPropertyOptions(target, constraint)
              return propertyOptions?.title ?? constraint
            }
            return constraint
          })
        }
        const args: ValidationMessageOptions = {
          object: error.target as object,
          value: error.value,
          targetName: (error.target as object)?.constructor?.name,
          property: error.property,
          constraints: metadata?.constraints,
          each: metadata?.each ?? false,
        }
        const buildMessage: BuildMessage = ValidationMessage.zh_CN[key]
        if (!buildMessage) {
          Logger.warn(`未找到 ${key} 的错误消息`, 'ValidationPipe')
          continue
        }
        const message = buildMessage(args) as string
        error.constraints[key] = replaceMessageSpecialTokens(message, args)
      }
    }
    return error
  })
}

function exceptionFactory(errors: ValidationError[]) {
  errors = formatValidationErrors(errors)
  const formattedErrors = flattenValidationErrors(errors)
  const message = formattedErrors.join('\n') || 'Validation failed'
  throw new UnprocessableEntityException(message)
}

export function useValidationPipe(options?: ValidationPipeOptions): ValidationPipe {
  const defaultOptions: ValidationPipeOptions = {
    transform: true, // 自动转换请求参数类型，如将字符串转换为数字类型
    whitelist: true, // 自动移除请求参数中未定义的属性
    forbidNonWhitelisted: false, // 当请求参数中包含未定义的属性时，抛出错误
    transformOptions: {
      enableImplicitConversion: true, // 启用隐式类型转换，如将字符串转换为数字类型
    },
    dismissDefaultMessages: true, // 是否禁用错误消息，默认为false
    validationError: {
      target: true,
      value: true,
    },
    stopAtFirstError: true, // 当遇到第一个错误时停止验证，默认为false
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 当验证失败时返回的HTTP状态码，默认为422
    exceptionFactory,
  }
  return new ValidationPipe({ ...defaultOptions, ...options })
}
