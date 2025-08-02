import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { CursorPaginationDto } from 'src/common/dto/pagination.dto'
import { Prisma } from 'src/generated/prisma/client'
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

  async getUser(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  async getUsers(query: CursorPaginationDto) {
    const cursor = query.before || query.after
    const users = await this.prismaService.user.findMany({
      orderBy: {
        id: isNil(query.after) ? 'desc' : 'asc',
      },
      cursor: isNil(cursor) ? undefined : { id: cursor },
      skip: isNil(query.before || query.after)
        ? undefined
        : 1,
      take: query.limit,
    })
    return users
  }
}
