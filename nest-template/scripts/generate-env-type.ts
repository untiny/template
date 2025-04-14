import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import dotenv from 'dotenv'

const logger = consola.withTag('generate-env-type')

function generateEnvType() {
  logger.start('Generating env type...')
  const dir = process.cwd()
  const targets = [
    '.env',
    `.env.${process.env.NODE_ENV || 'development'}`,
  ]

  const env: Record<string, string> = {}
  for (const target of targets) {
    const path = join(dir, target)
    logger.info(`Reading ${path}`)
    const { parsed } = dotenv.config({ path })
    if (parsed) {
      Object.assign(env, parsed)
    }
  }
  logger.box(JSON.stringify(env, null, 2))
  let envContent = 'export interface Env {\n'
  Object.entries(env).forEach(([key, _]) => {
    envContent += `  ${key}: string;\n`
  })
  envContent += '}\n'
  const directory = join(dir, 'src', 'generated', 'env')
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }
  const envTypePath = join(directory, 'index.ts')
  logger.info(`Writing ${envTypePath}`)
  writeFileSync(envTypePath, envContent)
  logger.success('Env type generated successfully')
}

generateEnvType()
