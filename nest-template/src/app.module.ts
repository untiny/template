import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ClsModule } from 'nestjs-cls'
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, I18nYamlLoader, QueryResolver } from 'nestjs-i18n'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { I18nValidationPipe } from './common/pipes/i18n-validation.pipe'
import { setupCls } from './common/setup-cls'
import { PrismaModule } from './prisma/prisma.module'
import { SharedModule } from './shared/shared.module'
import { SocketModule } from './socket/socket.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({ global: true, interceptor: { mount: true, setup: setupCls } }),
    I18nModule.forRoot({
      loader: I18nYamlLoader,
      fallbackLanguage: 'zh',
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
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
    PrismaModule,
    SharedModule,
    AuthModule,
    UserModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: I18nValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
  ],
})
export class AppModule {}
