import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
  @ApiPropertyOptional({ title: '页码', minimum: 1, default: 1 })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? Number.parseInt(value as string, 10) : 1)
  page_index?: number

  @ApiPropertyOptional({ title: '每页数量', minimum: 1, maximum: 100, default: 10 })
  @Min(1)
  @Max(100)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? Number.parseInt(value as string, 10) : 10)
  page_size?: number
}

export class PaginationResponseDto extends PaginationDto {
  @ApiProperty({ title: '总数量', minimum: 0, default: 0 })
  total: number
}

export class CursorPaginationDto {
  @ApiPropertyOptional({ minimum: 0, default: null, description: '上一页的最后一条数据的id' })
  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? Number.parseInt(value as string, 10) : null)
  before?: number

  @ApiPropertyOptional({ minimum: 0, default: null, description: '下一页的第一条数据的id' })
  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? Number.parseInt(value as string, 10) : null)
  after?: number

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10, description: '每页数量' })
  @Min(1)
  @Max(100)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? Number.parseInt(value as string, 10) : 10)
  limit?: number
}
