import type { LoggerService } from '@nestjs/common'
import { hash } from 'node:crypto'
import { sep } from 'node:path'
import { Cache, createCache } from 'cache-manager'
import { isDefined } from 'class-validator'
import { blue, cyan, gray, green, magenta, red, yellow } from 'kolorist'
import { isEmpty } from 'lodash'
import { TransformableInfo } from 'logform'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import TransportStream from 'winston-transport'
import 'winston-daily-rotate-file'

const SPACE = ' '

function joinLine(...items: string[]) {
  return items.join('')
}

function formatStack(stack: string, message: string, options?: {
  colors?: boolean
  paths?: boolean
}) {
  let lines = stack
    .split('\n')
    .splice(message.split('\n').length)
    .map(l => l.trim())

  if (options?.paths) {
    const cwd = process.cwd() + sep
    lines = lines.map(l => l.replace('file://', '').replace(cwd, ''))
  }

  // 格式化堆栈信息
  lines = lines.map(
    (line) => {
      return joinLine(
        SPACE.repeat(4),
        line
          .replace(/^at +/, m => options?.colors ? gray(m) : m)
          .replace(/\((.+)\)/, (_, m) => `(${options?.colors ? cyan(m as string) : m})`)
      )
    }
  )

  return `\n${lines.join('\n')}\n`
}

function formatLog() {
  return format.printf((options) => {
    const { level, timestamp, context, message, type, method, status, path, payload, stack, ...other } = options
    const headers = other.headers as Record<string, string> | undefined
    delete other.headers

    // 组装日志信息
    const main: string[] = []
    main.push(`[${level}]`, SPACE)
    if (isDefined(process?.pid)) {
      main.push(String(process.pid).padEnd(6), SPACE)
    }
    if (isDefined(timestamp)) {
      main.push(timestamp as string, SPACE)
    }
    if (isDefined(context)) {
      main.push(`[${context}]`, SPACE)
    }
    if (isDefined(message)) {
      main.push(message as string)
    }

    const messages = [joinLine(...main)]

    // 组装堆栈信息
    if (!isEmpty(stack)) {
      messages.push(formatStack(String(stack), String(message)))
    }

    // 组装请求信息
    const request: string[] = []
    if (isDefined(type)) {
      request.push(`[${type}]`, SPACE, '-', SPACE)
    }
    if (isDefined(method)) {
      request.push(method as string, SPACE)
    }
    if (isDefined(status)) {
      request.push(status as string, SPACE)
    }
    if (isDefined(path)) {
      request.push(path as string, SPACE)
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

    // 组装其他信息
    if (headers?.authorization) {
      messages.push(joinLine('[Authorization]', SPACE, '-', SPACE, headers.authorization))
    }
    if (headers?.cookie) {
      messages.push(joinLine('[Cookie]', SPACE, '-', SPACE, headers.cookie))
    }
    if (!isEmpty(payload)) {
      messages.push(joinLine('[Payload]', SPACE, '-', SPACE, JSON.stringify(payload)))
    }
    if (!isEmpty(other)) {
      messages.push(joinLine('[Other]', SPACE, '-', SPACE, JSON.stringify(other)))
    }

    return messages.join('\n')
  })
}

function consolePrintf(appName?: string) {
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

    // 组装日志信息
    const main: string[] = []
    if (isDefined(appName)) {
      main.push(color(`[${appName}]`), SPACE)
    }
    if (isDefined(process?.pid)) {
      main.push(color(String(process.pid)).padEnd(6), SPACE)
    }
    if (isDefined(timestamp)) {
      main.push(timestamp as string, SPACE)
    }
    main.push(color(level.toUpperCase().padStart(7)), SPACE)
    if (isDefined(context)) {
      main.push(yellow(`[${context}]`), SPACE)
    }
    if (isDefined(message)) {
      main.push(color(message as string))
    }
    if (isDefined(ms)) {
      main.push(SPACE, yellow(ms as string))
    }

    const messages = [joinLine(...main)]

    if (process?.env.DEBUG !== 'true') {
      return messages.join('\n')
    }

    // 组装堆栈信息
    if (!isEmpty(stack)) {
      messages.push(formatStack(String(stack), String(message), {
        colors: true,
        paths: true,
      }))
    }

    // 组装请求信息
    const request: string[] = []
    if (isDefined(type)) {
      request.push(blue(`[${type}]`), SPACE, gray('-'), SPACE)
    }
    if (isDefined(method)) {
      request.push(method as string, SPACE)
    }
    if (isDefined(status)) {
      request.push(status as string, SPACE)
    }
    if (isDefined(path)) {
      request.push(cyan(path as string), SPACE)
    }
    if (isDefined(headers?.referer)) {
      request.push(gray(`"${headers.referer}"`), SPACE)
    }
    if (isDefined(headers?.['user-agent'])) {
      request.push(gray(`"${headers['user-agent']}"`))
    }
    if (request.length > 0) {
      messages.push(request.join(''))
    }

    // 组装其他信息
    if (headers?.authorization) {
      messages.push(joinLine(blue('[Authorization]'), SPACE, gray('-'), SPACE, headers.authorization))
    }
    if (headers?.cookie) {
      messages.push(joinLine(blue('[Cookie]'), SPACE, gray('-'), SPACE, headers.cookie))
    }
    if (!isEmpty(payload)) {
      messages.push(joinLine(blue('[Payload]'), SPACE, gray('-'), SPACE, JSON.stringify(payload)))
    }
    if (!isEmpty(other)) {
      messages.push(joinLine(blue('[Other]'), SPACE, gray('-'), SPACE, JSON.stringify(other)))
    }
    return messages.join('\n')
  })
}

class WorkWeiXinTransport extends TransportStream {
  private cache: Cache
  private botKey?: string
  constructor(botKey?: string) {
    super()
    this.cache = createCache({ cacheId: 'work-wei-xin-winston' })
    this.botKey = botKey
    this.level = 'error'
  }

  log(info: TransformableInfo, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    if (!this.botKey) {
      callback()
      return
    }

    this.sendMessage(info)
      .then(() => {
        callback()
      })
      .catch(() => {
        callback()
      })
  }

  private async sendMessage(info: TransformableInfo) {
    const { timestamp, context, message, type, method, status, path } = info

    const messages: string[] = []
    if (isDefined(timestamp)) {
      messages.push(`时间：${timestamp}`)
    }
    if (isDefined(context)) {
      messages.push(`异常：${context}`)
    }
    if (isDefined(message)) {
      messages.push(`消息：${message}`)
    }
    if (isDefined(type)) {
      messages.push(`类型：${type}`)
    }
    if (isDefined(method)) {
      messages.push(`方法：${method}`)
    }
    if (isDefined(status)) {
      messages.push(`状态：${status}`)
    }
    if (isDefined(path)) {
      messages.push(`路径：${path}`)
    }

    const key = hash('md5', String(message))
    const cacheKey = `work-wei-xin-winston:${key}`
    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return
    }
    const data = { msgtype: 'text', text: { content: messages.join('\n') } }
    const body = JSON.stringify(data)

    const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.botKey}`

    await fetch(url, { method: 'POST', body })

    // 设置缓存三分钟
    await this.cache.set(cacheKey, true, 180000)
  }
}

export function useWinston(): LoggerService {
  const logger = WinstonModule.createLogger({
    // https://github.com/winstonjs/winston?tab=readme-ov-file#creating-your-own-logger
    level: 'debug', // 仅当 info.level 小于或等于此级别时才记录日志
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      formatLog()
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.ms(),
          consolePrintf(process?.env?.APP_NAME ?? 'Nest')
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
      new WorkWeiXinTransport(process?.env.WORK_WEI_XIN_WINSTON_BOT_KEY),
    ],
  })
  return logger
}
