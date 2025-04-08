import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHello() {
    await this.prismaService.user.findMany()
    await this.prismaService.$kysely.selectFrom('users').selectAll().execute()
    await this.prismaService.$extendTransaction(async (tx) => {
      await tx.user.findMany()
      await tx.$kysely.selectFrom('users').selectAll().execute()
    })
    return 'Hello World!'
  }
}
