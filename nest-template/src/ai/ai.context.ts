import { ToolCallOptions } from 'ai'

export class AiContext {
  user: RequestUser
  requestId?: string
  sessionId?: string
  agentId?: string
  protocol: 'LLM' | 'MCP'
  params?: unknown
  toolCallOptions?: ToolCallOptions

  constructor(user: RequestUser, requestId?: string, sessionId?: string, agentId?: string, protocol?: 'LLM' | 'MCP') {
    this.user = user
    this.requestId = requestId
    this.sessionId = sessionId
    this.agentId = agentId
    this.protocol = protocol ?? 'LLM'
  }

  static create(user: RequestUser, requestId?: string, sessionId?: string, agentId?: string, protocol?: 'LLM' | 'MCP') {
    return new AiContext(user, requestId, sessionId, agentId, protocol)
  }
}
