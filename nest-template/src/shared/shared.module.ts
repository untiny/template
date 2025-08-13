import { join } from 'node:path'
import { createKeyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import ms from 'ms'
import { ClsModule } from 'nestjs-cls'
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, I18nYamlLoader, QueryResolver } from 'nestjs-i18n'
import { setupCls } from 'src/common/setup-cls'
import { Env } from 'src/generated/env'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Env>) => {
        return {
          stores: createKeyv({
            url: configService.getOrThrow<string>('REDIS_URL'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          }),
          ttl: ms('1h'),
        }
      },
    }),
    ClsModule.forRoot({ global: true, interceptor: { mount: true, setup: setupCls } }),
    I18nModule.forRoot({
      loader: I18nYamlLoader,
      fallbackLanguage: 'zh',
      loaderOptions: {
        path: join('src', 'i18n'),
        watch: process.env.NODE_ENV !== 'production', // 生产环境关闭监听，开发环境开启
      },
      typesOutputPath: join('src', 'generated', 'i18n', 'index.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['lang'] },
        { use: CookieResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      logging: true,
    }),
    EventEmitterModule.forRoot({
      // 将其设置为“true”以使用通配符
      wildcard: false,
      // 用于分割命名空间的分隔符
      delimiter: '.',
      // 如果您想发出 newListener 事件，请将其设置为“true”
      newListener: false,
      // 如果您想发出removeListener事件，请将其设置为“true”
      removeListener: false,
      // 可以分配给事件的最大侦听器数量
      maxListeners: 10,
      // 当分配的侦听器数量超过最大数量时，在内存泄漏消息中显示事件名称
      verboseMemoryLeak: true,
      // 如果发出错误事件并且没有侦听器，则禁用抛出 uncaughtException
      ignoreErrors: true,
    }),
  ],
})
export class SharedModule {}
