import type { AnyObject } from '@scalar/openapi-parser'
import type { OpenAPI } from '@scalar/openapi-types'
import { dereference, load, upgrade } from '@scalar/openapi-parser'
import { fetchUrls } from '@scalar/openapi-parser/plugins/fetch-urls'
import { readFiles } from '@scalar/openapi-parser/plugins/read-files'

export type DocumentInput = string

export interface ProcessedDocument {
  document: OpenAPI.Document
  dereferenceMap: Map<AnyObject, string>
  downloaded: AnyObject
}

const cache = new Map<string, ProcessedDocument>()

export async function processDocument(
  document: DocumentInput,
  disableCache = false,
): Promise<ProcessedDocument> {
  const cached
    = !disableCache && typeof document === 'string' ? cache.get(document) : null

  if (cached)
    return cached

  const dereferenceMap = new Map()
  const loaded = await load(document, {
    plugins: [readFiles(), fetchUrls()],
  })

  // upgrade
  loaded.specification = upgrade(loaded.specification).specification
  const { schema: dereferenced } = await dereference(loaded.filesystem, {
    onDereference({ ref, schema }) {
      dereferenceMap.set(schema, ref)
    },
  })

  const processed: ProcessedDocument = {
    document: dereferenced!,
    dereferenceMap,
    downloaded: loaded.specification,
  }

  if (!disableCache && typeof document === 'string') {
    cache.set(document, processed)
  }

  return processed
}
