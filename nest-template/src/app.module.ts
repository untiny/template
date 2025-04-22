import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
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
    PrismaModule,
    SharedModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: I18nValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
  ],
})
export class AppModule {}
