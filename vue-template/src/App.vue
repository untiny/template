<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import { DefaultChatTransport } from "ai";
import { computed, ref } from "vue";
import type { PromptInputMessage } from "./components/ai-elements/prompt-input";

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "http://localhost:3000/api/chat",
    async fetch(input, init) {
      try {
        return await fetch(input, init);
      } finally {
        status.value = "ready";
      }
    },
  }),
});

const messages = computed(() => chat.messages);

const status = ref<"submitted" | "streaming" | "ready" | "error">("ready");

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = !!message.text;
  const hasAttachments = message.files?.length > 0;

  if (!hasText && !hasAttachments) {
    return;
  }

  status.value = "submitted";
  chat.sendMessage(message);
  status.value = "streaming";
};
</script>

<template>
  <div class="fixed bottom-0 top-0 left-0 right-0 p-4">
    <div class="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation class="mb-4">
        <ConversationContent>
          <Message
            v-for="message in messages"
            :key="message.id"
            :from="message.role"
          >
            <MessageContent>
              <div
                v-for="(part, index) in message.parts"
                :key="`${message.id}-${part.type}-${index}`"
              >
                <MessageResponse
                  v-if="part.type === 'text'"
                  :content="part.text"
                />
              </div>
            </MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <!-- <h1>Chat Messages</h1>

    <div v-for="(m, index) in chat.messages" :key="m.id ? m.id : index">
      {{ m.role === "user" ? "User: " : "AI: " }}
      <div
        v-for="(part, index) in m.parts"
        :key="`${m.id}-${part.type}-${index}`"
      >
        <div v-if="part.type === 'text'">{{ part.text }}</div>
      </div>
    </div> -->

      <PromptInputProvider @submit="handleSubmit">
        <PromptInput multiple global-drop class="w-full">
          <PromptInputAttachments>
            <template #default="{ file }">
              <PromptInputAttachment :file="file" />
            </template>
          </PromptInputAttachments>

          <PromptInputBody>
            <PromptInputTextarea />
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
