import { processDocument } from '@/utils/process-document'

export const useSwagger = createGlobalState((url: string) => {
  const { state, isReady, isLoading } = useAsyncState(processDocument(url), null)
  const document = computed(() => state.value?.document)
  return {
    isReady,
    isLoading,
    state,
    document,
  }
})
