<template>
  <div class="chat-container">
    <!-- Header -->
    <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
      <div class="chat-header">
        <div class="chat-title">
          <i class="bi bi-pencil-square"></i>
          <h3>NMSU-TutoringBot-MeatScience</h3>
        </div>
      </div>
    </Motion>

    <!-- Chat Content -->
    <div class="chat-content">
      <!-- Bot Info -->
      <Motion :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }">
        <div class="bot-info justify-between">
          <div>
            <h2>IntelligentTutor-MeatScience</h2>
            <p class="bot-status">Set as default</p>
          </div>
          <div>
            <button
              class="border border-red-200 text-red-400 rounded-full px-10 py-2 hover:bg-red-100 hover:transition-all hover:duration-300 hover:shadow-md"
              @click="logout">Logout</button>
          </div>
        </div>
      </Motion>

      <!-- Messages -->
      <div class="chat-messages" v-if="messages.length > 0 || isLoading">
        <Motion v-for="(message, index) in messages" :key="message.id" :initial="{ opacity: 0, y: 20, scale: 0.95 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.5, delay: message.sender === 'user' ? 0 : 0.3, type: 'spring', stiffness: 200, damping: 20 }">
          <div class="message-container" :class="message.sender">
            <div class="message-bubble" :class="message.sender">
              <!-- Avatar -->
              <div v-if="message.sender === 'user'" class="user-avatar"><i class="bi bi-person"></i></div>
              <div v-if="message.sender === 'bot'" class="bot-avatar">
                <div class="bot-logo"><span class="bot-logo-text">NMSU</span></div>
              </div>

              <!-- Message Content -->
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">{{ message.sender === 'user' ? 'You' : 'NMSU' }}</span>
                  <span v-if="message.sender === 'bot'" class="bot-status">IntelligentTutor-MeatScience</span>
                </div>
                <div class="message-text">{{ message.text }}</div>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Typing Indicator -->
        <Motion v-if="isLoading" :initial="{ opacity: 0, y: 20, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.5 }">
          <div class="message-container bot">
            <div class="message-bubble bot loading">
              <div class="bot-avatar">
                <div class="bot-logo"><span class="bot-logo-text">NMSU</span></div>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">NMSU</span>
                  <span class="bot-status">IntelligentTutor-MeatScience</span>
                </div>
                <div class="message-text">
                  <Motion :animate="{ opacity: [0.3, 1, 0.3] }" :transition="{ duration: 1.5, repeat: Infinity }">
                    <div class="typing-indicator">
                      <span class="typing-dot"></span>
                      <span class="typing-dot"></span>
                      <span class="typing-dot"></span>
                    </div>
                  </Motion>
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <!-- Welcome Message if empty -->
      <Motion v-else :initial="{ opacity: 0, y: 30, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
        :transition="{ duration: 0.8, delay: 0.3 }">
        <div class="chat-welcome">
          <h3 class="welcome-message">How can I help you today?</h3>
        </div>
      </Motion>
    </div>

    <!-- Input -->
    <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.4 }">
      <div class="chat-input-container">
        <div class="input-wrapper">
          <input type="text" placeholder="Send a message" class="message-input" v-model="messageText"
            @keyup.enter="sendMessage" />
          <button class="send-button" @click="sendMessage">
            <i class="bi bi-send mt-1"></i>
          </button>
        </div>
        <p class="disclaimer">LLMs can make mistakes. Verify important information.</p>
      </div>
    </Motion>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { Motion } from 'motion-v'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()
const messageText = ref('')
const messages = ref([]) // start empty
const isLoading = ref(false)

// Scroll to bottom whenever messages change
const scrollToBottom = () => {
  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages')
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight
  })
}
watch([messages, isLoading], () => scrollToBottom(), { deep: true })

// Send message to FastAPI backend
const sendMessage = async () => {
  if (!messageText.value.trim()) return

  // Add user message
  messages.value.push({
    id: Date.now(),
    text: messageText.value,
    sender: 'user',
    timestamp: new Date()
  })

  const question = messageText.value
  messageText.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('http://localhost:8000/ask', { question })
    const botAnswer = response.data.answer || "Sorry, I couldn't get a response."
    console.log(response)

    messages.value.push({
      id: Date.now() + 1,
      text: botAnswer,
      sender: 'bot',
      timestamp: new Date()
    })
  } catch (error) {
    messages.value.push({
      id: Date.now() + 1,
      text: "Error contacting API.",
      sender: 'bot',
      timestamp: new Date()
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped src="../styles/chat.css"></style>
<style scoped src="../styles/chatMessages.css"></style>
<style scoped src="../styles/animation.css"></style>
