import { isEmpty } from 'lodash'
import { utilities, WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

export function useWinston() {
  const logger = WinstonModule.createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.ms(),
      format.errors({ stack: true }),
      format.printf(({ context, level, message, timestamp, stack, ms, type, path, status, method, ...other }) => {
        const logs: string[] = [
          typeof timestamp !== 'undefined' ? `${timestamp} ` : '',
          `${level} `,
          typeof context !== 'undefined' ? `[${context}] ` : '',
          typeof type !== 'undefined' ? `${type} ` : '',
          typeof method !== 'undefined' ? `${method} ` : '',
          typeof path !== 'undefined' ? `${path} ` : '',
          typeof status !== 'undefined' ? `${status} ` : '',
          `${message} `,
          typeof ms !== 'undefined' ? `${ms} ` : '',
          typeof other !== 'undefined' && !isEmpty(other) ? `\n${JSON.stringify(other)} ` : '',
          typeof stack !== 'undefined' && !isEmpty(stack) ? `\n${stack} ` : '',
        ]
        return logs.join('')
      })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.ms(),
          format.errors({ stack: true }),
          utilities.format.nestLike('NestJS', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        ),
      }),
      new DailyRotateFile({
        dirname: 'logs', // 日志文件目录
        extension: '.log', // 日志文件后缀名
        level: 'error', // 日志级别
        filename: '%DATE%.error', // 日志文件名，占位符为 %DATE%
        datePattern: 'YYYY-MM-DD', // 日期格式
      }),
      new DailyRotateFile({
        dirname: 'logs', // 日志文件目录
        extension: '.log', // 日志文件后缀名
        level: 'warn', // 日志级别
        filename: '%DATE%.combined', // 日志文件名，占位符为 %DATE%
        datePattern: 'YYYY-MM-DD', // 日期格式
      }),
    ],
  })
  return logger
}
