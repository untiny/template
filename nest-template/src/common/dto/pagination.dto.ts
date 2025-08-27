import { Transform } from 'class-transformer'
import { IsInt } from 'class-validator'
import { Property } from '../decorators'

export class PaginationDto {
  @Property({ required: false, title: '页码', minimum: 1, default: 1, type: 'integer' })
  @IsInt()
  @Transform(({ value }) => (value ? Number.parseInt(value as string, 10) : 1))
  page_index?: number

  @Property({ required: false, title: '每页数量', minimum: 1, maximum: 100, default: 10, type: 'integer' })
  @IsInt()
  @Transform(({ value }) => (value ? Number.parseInt(value as string, 10) : 10))
  page_size?: number
}

export class PaginationResponseDto extends PaginationDto {
  @Property({ title: '总数量', minimum: 0, default: 0 })
  total: number
}

export class CursorPaginationDto {
  @Property({ required: false, minimum: 0, default: null, description: '上一页的最后一条数据的id', type: 'integer' })
  @IsInt()
  @Transform(({ value }) => (value ? Number.parseInt(value as string, 10) : null))
  before?: number

  @Property({ required: false, minimum: 0, default: null, description: '下一页的第一条数据的id', type: 'integer' })
  @IsInt()
  @Transform(({ value }) => (value ? Number.parseInt(value as string, 10) : null))
  after?: number

  @Property({ required: false, minimum: 1, maximum: 100, default: 10, description: '每页数量', type: 'integer' })
  @IsInt()
  @Transform(({ value }) => (value ? Number.parseInt(value as string, 10) : 10))
  limit?: number
}
