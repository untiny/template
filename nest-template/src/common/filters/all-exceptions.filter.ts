import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { RpcException } from '@nestjs/microservices'
import { WsException } from '@nestjs/websockets'
import { Prisma } from '@prisma/client'
import { isArray, isObject } from 'lodash'
import { throwError } from 'rxjs'
import { Socket } from 'socket.io'
import { ExceptionResponseDto } from '../dto/exception-response.dto'
import { formatI18nException, getI18nContext } from '../utils'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const i18n = getI18nContext(host)
    const status = this.getStatus(exception) ?? HttpStatus.INTERNAL_SERVER_ERROR
    const message = formatI18nException(this.getMessage(exception), i18n!)
    const stack = exception instanceof Error ? exception.stack : undefined
    const context = exception instanceof Error ? exception.constructor.name : AllExceptionsFilter.name
    const exceptionResponse = new ExceptionResponseDto(message, status, context)
    switch (host.getType()) {
      case 'http':
        return this.handleHttpError(host, exceptionResponse, stack)
      case 'ws':
        return this.handleWsError(host, exceptionResponse, stack)
      case 'rpc':
        return this.handleRpcError(host, exceptionResponse, stack)
    }
  }

  handleHttpError(host: ArgumentsHost, exceptionResponse: ExceptionResponseDto, stack?: string) {
    const ctx = host.switchToHttp()
    const { httpAdapter } = this.httpAdapterHost
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    this.logger({
      type: host.getType().toLocaleUpperCase(),
      method: request.method,
      path: request.url,
      stack,
      headers: request.headers,
      payload: request.body,
      ...exceptionResponse,
    })

    httpAdapter.reply(response, exceptionResponse, exceptionResponse.status)
  }

  handleWsError(host: ArgumentsHost, exceptionResponse: ExceptionResponseDto, stack?: string) {
    const ctx = host.switchToWs()
    const client = ctx.getClient<Socket>()
    const pattern = ctx.getPattern()
    const payload = ctx.getData()
    this.logger({
      type: host.getType().toLocaleUpperCase(),
      path: pattern,
      stack,
      ...exceptionResponse,
      payload,
    })

    client.emit('exception', exceptionResponse)
  }

  handleRpcError(host: ArgumentsHost, exceptionResponse: ExceptionResponseDto, stack?: string) {
    const ctx = host.switchToRpc()
    const pattern = ctx.getContext()?.getPattern()
    const payload = ctx.getData()
    this.logger({
      type: host.getType().toLocaleUpperCase(),
      path: pattern,
      stack,
      ...exceptionResponse,
      payload,
    })

    return throwError(() => exceptionResponse)
  }

  logger(params: ExceptionResponseDto & {
    type?: string
    path?: string
    method?: string
    stack?: string
    [key: string]: any
  }) {
    const { stack, ...optionalParams } = params
    if (params.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return Logger.error(optionalParams, stack)
    }
    return Logger.warn(optionalParams)
  }

  getMessage(exception: unknown): string {
    let message: string | undefined
    if (typeof exception === 'string') {
      message = exception
    }
    // else if (exception instanceof ValidationException) {
    //   message = formatValidationErrorMessage(exception.errors, this.cls.get('language'))
    // }
    else if (exception instanceof HttpException) {
      const error = exception.getResponse()
      if (typeof error === 'string') {
        message = error
      }
      else if (isObject(error) && error !== null) {
        message = Reflect.get(error, 'message')
      }
      else {
        message = exception.message
      }
    }
    else if (exception instanceof WsException || exception instanceof RpcException) {
      const error = exception.getError()
      message = typeof error === 'string' ? error : Reflect.get(error, 'message')
    }
    else if (
      exception instanceof Prisma.PrismaClientValidationError
      || exception instanceof Prisma.PrismaClientKnownRequestError
      || exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      const { code, meta } = exception as Prisma.PrismaClientKnownRequestError
      const messages = [
        exception.name,
        code,
        meta?.modelName,
        exception.message.split('\n').pop(), // Prisma 得异常信息都是包括有代码的，只有最后一行才是人类可读的
      ]
      message = messages.filter(Boolean).join(' ')
    }
    else if (exception instanceof Error) {
      message = exception.message
    }
    else if (isArray(exception)) {
      message = exception.join(';\n')
    }
    else if (isObject(exception) && exception !== null) {
      message = Reflect.get(exception, 'message')
    }
    else {
      message = JSON.stringify(exception)
    }
    if (isArray(message)) {
      message = message.join('\n')
    }
    return message ?? 'unknown error'
  }

  getStack(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack
    }
  }

  getStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000':
        case 'P2003':
          return HttpStatus.BAD_REQUEST

        case 'P2002':
          return HttpStatus.CONFLICT

        case 'P2025':
          return HttpStatus.NOT_FOUND

        default:
          return HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return HttpStatus.BAD_REQUEST
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }
}
