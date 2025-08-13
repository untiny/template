import { ITXClientDenyList } from '@prisma/client/runtime/library'
import { Kysely } from 'kysely'
import { DB } from 'src/generated/kysely'
import { PrismaClient } from 'src/generated/prisma/client'

export interface PrismaContext extends Omit<PrismaClient, ITXClientDenyList> {}

export interface PrismaContextWithKysely extends PrismaContext {
  $kysely: Kysely<DB>
}

export interface PrismaTransactionFnWithKysely<R = any> {
  (prisma: PrismaContextWithKysely): Promise<R>
}
