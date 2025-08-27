import { isDefined } from 'class-validator'
import { generateSnowflakeId } from 'src/common/utils'
import { Prisma } from 'src/generated/prisma/client'

type CreateArgs = Prisma.UserCreateArgs | Prisma.UserCreateManyArgs
type UpsertArgs = Prisma.UserUpsertArgs

function createSnowflakeId<T extends CreateArgs>(args: T): T {
  if (Array.isArray(args.data)) {
    args.data = args.data.map((item) => {
      if (!isDefined(item.id)) {
        item.id = generateSnowflakeId()
      }
      return item
    })
  } else if (isDefined(args.data) && !isDefined(args.data.id)) {
    args.data.id = generateSnowflakeId()
  }
  return args
}

function upsertSnowflakeId<T extends UpsertArgs>(args: T): T {
  if (!isDefined(args.create.id)) {
    args.create.id = generateSnowflakeId()
  }
  return args
}

export const snowflakeExtend = Prisma.defineExtension({
  name: 'snowflakeExtend',
  query: {
    user: {
      create({ args, query }) {
        return query(createSnowflakeId(args))
      },
      createMany({ args, query }) {
        return query(createSnowflakeId(args))
      },
      upsert({ args, query }) {
        return query(upsertSnowflakeId(args))
      },
    },
  },
})
