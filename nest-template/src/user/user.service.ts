import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 按邮箱检查是否已存在，存在则直接报错 */
  async checkEmailExist(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { email: true },
    })
    if (user) {
      throw new ConflictException('邮箱已存在')
    }
  }

  /** 按邮箱获取用户信息 */
  async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data,
    })
  }
}
