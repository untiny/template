<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import {
  DefaultChatTransport,
  generateId,
  type DataUIPart,
  type ToolUIPart,
  type UIDataTypes,
  type UIMessagePart,
  type UITools,
} from "ai";
import { computed } from "vue";
import type { PromptInputMessage } from "./components/ai-elements/prompt-input";

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "http://192.168.10.98:3090/main/xiao-mian/chat",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmFjdG9yeV9pZCI6MSwiaWF0IjoxNzY2MTA4MjMyLCJleHAiOjE3NjY3MTMwMzJ9.kBbSifm4CdLy4A2RjhQHJ51_zsr8EKwukhUMsb0QdTM",
    },
    prepareSendMessagesRequest({ messages, id }) {
      // 只发送最后一条消息
      return { body: { message: messages[messages.length - 1], id } };
    },
  }),
  onError: (error) => {
    console.error(error);
    chat.messages.push({
      role: "assistant",
      parts: [{ type: "text", text: error.message }],
      id: generateId(),
    });
  },
});

const messages = computed(() => chat.messages);

const status = computed(() => chat.status);

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = !!message.text;
  const hasAttachments = message.files?.length > 0;

  if (!hasText && !hasAttachments) {
    return;
  }

  chat.sendMessage(message);
};

function isStreamingPart(messageIndex: number, partIndex: number) {
  const lastMsg = messages.value[messages.value.length - 1];
  const msg = messages.value[messageIndex];

  if (!lastMsg || msg?.id !== lastMsg.id) return false;

  const isLastPart =
    msg?.parts?.length > 0 && partIndex === msg?.parts?.length - 1;
  return status.value === "streaming" && isLastPart;
}

function isToolPart(partType: string): partType is `tool-${string}` {
  return partType.startsWith("tool-");
}

function isDataPart(partType: string): partType is `data-${string}` {
  return partType.startsWith("data-");
}

function toolPart(part: UIMessagePart<UIDataTypes, UITools>) {
  return part as ToolUIPart<UITools>;
}

function dataPart(part: UIMessagePart<UIDataTypes, UITools>) {
  return part as DataUIPart<UIDataTypes>;
}
</script>

<template>
  <div class="fixed bottom-0 top-0 left-0 right-0 p-4">
    <div class="relative flex size-full flex-col overflow-hidden">
      <Conversation class="mb-4">
        <ConversationContent>
          <Message
            v-for="(message, messageIndex) in messages"
            :key="message.id"
            :from="message.role"
          >
            <MessageContent>
              <template
                v-for="(part, partIndex) in message.parts"
                :key="`${message.id}-${part.type}-${partIndex}`"
              >
                <template v-if="part.type === 'text'">
                  <MessageResponse :content="part.text" />
                </template>
                <template v-else-if="part.type === 'reasoning'">
                  <Reasoning
                    class="w-full"
                    :is-streaming="isStreamingPart(messageIndex, partIndex)"
                  >
                    <ReasoningTrigger />
                    <ReasoningContent :content="part.text" />
                  </Reasoning>
                </template>
                <template v-else-if="part.type === 'file'">
                  <img
                    v-if="part.mediaType.startsWith('image/')"
                    :alt="part.filename"
                    :src="part.url"
                  />
                  <div v-else>{{ part.filename }}</div>
                </template>
                <template v-else-if="part.type === 'source-document'">
                  <div>{{ part.title }}</div>
                </template>
                <template v-else-if="part.type === 'source-url'">
                  <Sources>
                    <SourcesContent>
                      <Source
                        :href="part.url"
                        :title="part.title ?? part.url"
                      />
                    </SourcesContent>
                  </Sources>
                </template>
                <template v-else-if="part.type === 'step-start'"></template>
                <template v-else-if="isDataPart(part.type)">
                  <CodeBlock
                    :code="JSON.stringify(dataPart(part).data ?? {}, null, 2)"
                    language="json"
                  />
                </template>
                <template v-else-if="part.type === 'dynamic-tool'">
                  <Tool default-open>
                    <ToolHeader
                      :state="part.state"
                      :title="part.toolName"
                      type="tool-dynamic-tool"
                    />
                    <ToolContent>
                      <ToolInput :input="part.input" />
                      <ToolOutput
                        :output="part.output"
                        :error-text="part.errorText"
                      />
                    </ToolContent>
                  </Tool>
                </template>
                <template v-else-if="isToolPart(part.type)">
                  <!-- 这里可以根据 part.type 来决定使用什么组件, 可以自定义 -->
                  <Tool class="w-full" :default-open="false">
                    <ToolHeader
                      :state="toolPart(part).state"
                      :type="part.type"
                    />
                    <ToolContent>
                      <ToolInput :input="toolPart(part).input" />
                      <ToolOutput
                        :output="toolPart(part).output"
                        :error-text="toolPart(part).errorText"
                      />
                    </ToolContent>
                  </Tool>
                </template>
              </template>
            </MessageContent>
          </Message>
          <Loader v-if="status === 'submitted'" />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInputProvider @submit="handleSubmit">
        <PromptInput multiple global-drop class="w-full">
          <PromptInputAttachments>
            <template #default="{ file }">
              <PromptInputAttachment :file="file" />
            </template>
          </PromptInputAttachments>

          <PromptInputBody>
            <PromptInputTextarea placeholder="你想知道什么?" />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>

            <PromptInputSubmit :status="status" />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  </div>
</template>
