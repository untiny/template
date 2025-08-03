import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { AuthUser } from 'src/auth/decorators'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CursorPaginationDto } from 'src/common/dto/pagination.dto'
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigint.pipe'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  async getUsers(@Query() query: CursorPaginationDto) {
    return await this.userService.getUsers(query)
  }

  @Get('@me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiBearerAuth()
  async getCurrentUser(@AuthUser('id', ParseBigIntPipe) id: bigint) {
    return await this.userService.getUser(id)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiParam({ name: 'id', type: 'integer', description: '用户ID' })
  async getUser(@Param('id', ParseBigIntPipe) id: bigint) {
    return await this.userService.getUser(id)
  }

  // @Patch('@me')
  // @ApiOperation({ summary: '更新当前用户信息' })
  // async updateCurrentUser() {
  //   return await this.userService.updateCurrentUser()
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: '更新用户信息' })
  // async updateUser() {
  //   return await this.userService.updateUser()
  // }

  // @Delete('@me')
  // @ApiOperation({ summary: '删除当前用户' })
  // async deleteCurrentUser() {
  //   return await this.userService.deleteCurrentUser()
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: '删除用户' })
  // async deleteUser() {
  //   return await this.userService.deleteUser()
  // }
}
