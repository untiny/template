import { createKeyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            createKeyv({
              url: 'redis://192.168.10.200:6379',
              password: 'fkplkokg5',
            }),
          ],
          cacheId: 'nest-template',
        }
      },
    }),
  ],
})
export class SharedModule {}
