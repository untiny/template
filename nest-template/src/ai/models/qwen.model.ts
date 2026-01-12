import { LanguageModel } from 'ai'
import { createQwen } from 'qwen-ai-provider-v5'

export const qwen = createQwen({ baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1' })

export const qwen3VlPlus: LanguageModel = qwen('qwen3-vl-plus')
export const qwen3Max: LanguageModel = qwen('qwen3-max')
