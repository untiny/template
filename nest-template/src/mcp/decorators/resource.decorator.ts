import { ResourceMetadata, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { MCP_RESOURCE_METADATA_KEY } from './constants'

export interface ResourceOptions extends ResourceMetadata {
  name: string
  uriOrTemplate: ResourceTemplate | string
}

export function Resource(name: string, uri: string, config?: ResourceMetadata): CustomDecorator<string>
export function Resource(name: string, template: ResourceTemplate, config?: ResourceMetadata): CustomDecorator<string>
export function Resource(name: string, uriOrTemplate: string | ResourceTemplate, config?: ResourceMetadata) {
  return SetMetadata(MCP_RESOURCE_METADATA_KEY, { name, uriOrTemplate, ...config })
}
