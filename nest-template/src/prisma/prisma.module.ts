import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return PrismaService.create(configService)
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
