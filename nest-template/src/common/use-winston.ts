import type { LoggerService } from '@nestjs/common'
import { utilities, WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import 'winston-daily-rotate-file'

export function useWinston(): LoggerService {
  const logger = WinstonModule.createLogger({
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
