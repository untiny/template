import type { LoggerService } from '@nestjs/common'
import { sep } from 'node:path'
import { inspect } from 'node:util'
import { isDefined } from 'class-validator'
import { blue, cyan, gray, green, magenta, red, yellow } from 'kolorist'
import { isEmpty } from 'lodash'
import { utilities, WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import 'winston-daily-rotate-file'

function formatStack(stack: string, message: string) {
  const cwd = process.cwd() + sep

  const lines = stack
    .split('\n')
    .splice(message.split('\n').length)
    .map(l => l.trim().replace('file://', '').replace(cwd, ''))

  return lines.map(
    line =>
      `  ${
        line
          .replace(/^at +/, m => gray(m))
          .replace(/\((.+)\)/, (_, m) => `(${cyan(m as string)})`)}`,
  )
    .join(`\n`)
}

function prettyLog() {
  return format.printf((options) => {
    const { level, timestamp, context, message, type, method, status, path, payload, stack, ...other } = options
    const headers = other.headers as Record<string, string> | undefined
    delete other.headers
    const messages = [
      `[${level}] ${String(process?.pid)} - ${timestamp} ${context ? `[${context}] ` : ''}${message}`,
      `[${type}] - ${method ? `${method} ` : ''}${status} ${path} "${headers?.referer ?? '--'}" "${headers?.['user-agent'] ?? '--'}"`,
    ]
    if (headers?.authorization) {
      messages.push(`[Authorization] - ${headers.authorization}`,)
    }
    if (headers?.cookie) {
      messages.push(`[Cookie] - ${headers.cookie}`,)
    }
    if (!isEmpty(payload)) {
      messages.push(`[Payload] - ${JSON.stringify(payload)}`,)
    }
    if (!isEmpty(other)) {
      messages.push(`[Other] - ${JSON.stringify(other)}`,)
    }
    if (!isEmpty(stack)) {
      messages.push(stack as string)
    }
    return messages.join('\n')
  })
}

function prettyPrint(appName?: string) {
  const nestLikeColorScheme: Record<string, (text: string) => string> = {
    log: green,
    error: red,
    warn: yellow,
    debug: magenta,
    verbose: cyan,
  }

  const noColor = (text: string) => text

  return format.printf((options) => {
    if (options.level === 'info') {
      options.level = 'log'
    }
    const { level, timestamp, context, message, type, method, status, path, payload, stack, ms, ...other } = options
    const headers = other.headers as Record<string, string> | undefined
    delete other.headers

    const color = nestLikeColorScheme[level] ?? noColor

    const logs: string[] = []
    const SPACE = ' '

    if (isDefined(appName)) {
      logs.push(color(`[${appName}]`), SPACE)
    }
    if (isDefined(process?.pid)) {
      logs.push(color(String(process.pid)).padEnd(6), SPACE)
    }
    if (isDefined(timestamp)) {
      logs.push(timestamp as string, SPACE)
    }
    logs.push(color(level.toUpperCase().padStart(7)), SPACE)
    if (isDefined(context)) {
      logs.push(yellow(`[${context}]`), SPACE)
    }
    if (isDefined(message)) {
      logs.push(color(message as string))
    }
    if (isDefined(ms)) {
      logs.push(SPACE, yellow(ms as string))
    }

    const messages = [
      logs.join(''),
      // `[${type}] - ${method ? `${method} ` : ''}${status} ${path} "${headers?.referer ?? '--'}" "${headers?.['user-agent'] ?? '--'}"`,
    ]

    const request: string[] = []
    if (isDefined(type)) {
      request.push(blue(`[${type}]`), SPACE, '-', SPACE)
    }
    if (isDefined(method)) {
      request.push(blue(method as string), SPACE)
    }
    if (isDefined(status)) {
      request.push(blue(status as string), SPACE)
    }
    if (isDefined(path)) {
      request.push(cyan(path as string), SPACE)
    }
    if (isDefined(headers?.referer)) {
      request.push(`"${headers.referer}"`, SPACE)
    }
    if (isDefined(headers?.['user-agent'])) {
      request.push(`"${headers['user-agent']}"`)
    }

    if (request.length > 0) {
      messages.push(request.join(''))
    }

    if (headers?.authorization) {
      messages.push(`[Authorization] - ${headers.authorization}`,)
    }
    if (headers?.cookie) {
      messages.push(`[Cookie] - ${headers.cookie}`,)
    }
    if (!isEmpty(payload)) {
      messages.push(`[Payload] - ${JSON.stringify(payload)}`,)
    }
    if (!isEmpty(other)) {
      messages.push(`[Other] - ${JSON.stringify(other)}`,)
    }
    if (!isEmpty(stack)) {
      messages.push(formatStack(String(stack), message as string))
    }
    return messages.join('\n')
  })
}

export function useWinston(): LoggerService {
  const logger = WinstonModule.createLogger({
    // https://github.com/winstonjs/winston?tab=readme-ov-file#creating-your-own-logger
    level: 'debug', // 仅当 info.level 小于或等于此级别时才记录日志
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      prettyLog()
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.ms(),
          utilities.format.nestLike('NestJS', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
          prettyPrint('NestJS')
        ),
      }),
      new transports.DailyRotateFile({
        dirname: 'logs', // 日志文件目录
        extension: '.log', // 日志文件后缀名
        level: 'error', // 日志级别
        filename: '%DATE%.error', // 日志文件名，占位符为 %DATE%
        datePattern: 'YYYY-MM-DD', // 日期格式
      }),
      new transports.DailyRotateFile({
        dirname: 'logs', // 日志文件目录
        extension: '.log', // 日志文件后缀名
        level: 'warn', // 日志级别
        filename: '%DATE%.combined', // 日志文件名，占位符为 %DATE%
        datePattern: 'YYYY-MM-DD', // 日期格式
      }),
      new transports.Http({
        level: 'warn',
        format: format.json(),
      }),
    ],
  })
  return logger
}
