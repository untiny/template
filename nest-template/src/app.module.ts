import { Module } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { I18nValidationPipe } from './common/pipes/i18n-validation.pipe'
import { McpModule } from './mcp/mcp.module'
import { PrismaModule } from './prisma/prisma.module'
import { SharedModule } from './shared/shared.module'
import { SocketModule } from './socket/socket.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [SharedModule, PrismaModule, AuthModule, UserModule, SocketModule, McpModule],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: I18nValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
  ],
})
export class AppModule {}
