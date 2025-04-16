import { HttpStatus, Inject, UnprocessableEntityException, ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { formatValidationErrorMessage } from '../utils'

export class I18nValidationPipe extends ValidationPipe {
  @Inject()
  private readonly cls: ClsService

  constructor(options?: Omit<ValidationPipeOptions, 'exceptionFactory'>) {
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
      exceptionFactory: (errors) => {
        const message = formatValidationErrorMessage(errors, this.cls.get('language'))
        throw new UnprocessableEntityException(message)
      },
    }
    super({ ...defaultOptions, ...options })
  }
}
