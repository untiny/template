import { networkInterfaces } from 'node:os'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { Env } from 'src/generated/env'

// 获取当前设备的IP地址
export function ips(): string[] {
  const nets = networkInterfaces()
  const ips = Object.values(nets)
    .flat()
    .filter((net) => net?.family === 'IPv4' && !net.internal && net?.address)
    .map((net) => net?.address)
  return ips as string[]
}

export async function useServerUrl(app: NestExpressApplication) {
  const configService = app.get<ConfigService<Env>>(ConfigService)
  const path = configService.get<string>('SWAGGER_DOCS_PATH', 'api-docs')
  const port = configService.get<number>('APP_PORT', 3000)

  const url = await app.getUrl()
  const localUrl = `http://localhost:${port}`
  const docsUrl = `${localUrl}/${path}`

  Logger.log(url, 'Server URL')
  Logger.log(localUrl, 'Local URL')
  Logger.log(docsUrl, 'Docs URL')
  ips().forEach((ip) => {
    Logger.log(`http://${ip}:${port}`, 'Network URL')
  })
}
