<template>
  <div class="chat-container">
    <!-- 🧭 Header -->
    <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
      <div class="chat-header">
        <div class="chat-title">
          <i class="bi bi-pencil-square"></i>
          <h3>NMSU-TutoringBot-MeatScience</h3>
        </div>
        <button class="menu-toggle-btn" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </Motion>

    <!-- 🧠 Chat Content -->
    <div class="chat-content">
      <!-- Bot Info / matches your InicioView -->
      <Motion :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.5, delay: 0.2 }">
        <div class="bot-info justify-between">
          <div>
            <h2>IntelligentTutor-MeatScience</h2>
            <p class="bot-status">Set as default</p>
          </div>
          <div class="bot-actions">
            <Motion v-for="(button, index) in 3" :key="index"
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :transition="{ duration: 0.3, delay: 0.4 + (index * 0.1) }">
              <button class="btn-icon" v-if="index === 0"><i class="bi bi-chevron-down"></i></button>
              <button class="btn-icon" v-else-if="index === 1"><i class="bi bi-plus"></i></button>
              <button class="btn-icon" v-else><i class="bi bi-gear"></i></button>
            </Motion>
          </div>
        </div>
      </Motion>

      <!-- 💬 Messages -->
      <div class="chat-messages" v-if="messages.length > 0 || isLoading">
        <Motion v-for="(message, index) in messages" :key="message.id"
                :initial="{ opacity: 0, y: 20, scale: 0.95 }"
                :animate="{ opacity: 1, y: 0, scale: 1 }"
                :transition="{ duration: 0.5, delay: message.sender === 'user' ? 0 : 0.3, type: 'spring', stiffness: 200, damping: 20 }">
          <div class="message-container" :class="message.sender">
            <div class="message-bubble" :class="message.sender">

              <!-- User avatar -->
              <Motion v-if="message.sender === 'user'" :initial="{ opacity: 0, scale: 0 }"
                      :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.3, delay: 0.1 }">
                <div class="user-avatar"><i class="bi bi-person"></i></div>
              </Motion>

              <!-- Bot avatar (NMSU crimson square) -->
              <Motion v-if="message.sender === 'bot'" :initial="{ opacity: 0, scale: 0, rotate: -180 }"
                      :animate="{ opacity: 1, scale: 1, rotate: 0 }" :transition="{ duration: 0.5, delay: 0.2 }">
                <div class="bot-avatar">
                  <div class="bot-logo"><span class="bot-logo-text">NMSU</span></div>
                </div>
              </Motion>

              <!-- Message content -->
              <Motion :initial="{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }"
                      :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.4, delay: 0.2 }">
                <div class="message-content">
                  <div class="message-header" v-if="message.sender === 'user'">
                    <span class="sender-name">You</span>
                  </div>
                  <div class="message-header" v-if="message.sender === 'bot'">
                    <span class="sender-name">NMSU</span>
                    <span class="bot-status">IntelligentTutor-MeatScience</span>
                  </div>
                  <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.6, delay: 0.4 }">
                    <div class="message-text" v-html="message.text"></div>
                  </Motion>
                </div>
              </Motion>
            </div>
          </div>
        </Motion>

        <!-- Typing indicator -->
        <Motion v-if="isLoading" :initial="{ opacity: 0, y: 20, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :transition="{ duration: 0.5 }">
          <div class="message-container bot">
            <div class="message-bubble bot loading">
              <Motion :initial="{ opacity: 0, scale: 0 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.3, delay: 0.2 }">
                <div class="bot-avatar">
                  <div class="bot-logo"><span class="bot-logo-text">NMSU</span></div>
                </div>
              </Motion>
              <Motion :initial="{ opacity: 0, x: -20 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.4, delay: 0.3 }">
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender-name">NMSU</span>
                    <span class="bot-status">IntelligentTutor-MeatScience</span>
                  </div>
                  <div class="message-text">
                    <Motion :animate="{ opacity: [0.3, 1, 0.3] }" :transition="{ duration: 1.5, repeat: Infinity }">
                      <div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
                    </Motion>
                  </div>
                </div>
              </Motion>
            </div>
          </div>
        </Motion>

        <!-- 🧠 QUIZ inside chat card (looks native) -->
        <div v-if="showQuiz" class="quiz-box">
          <h3>{{ currentQuestion }}</h3>
          <div v-for="option in quizOptions" :key="option">
            <button @click="selectAnswer(option)">{{ option }}</button>
          </div>
        </div>

        <!-- 🏆 SCORE (compact) -->
        <div class="score-info">
          <span>Messages: {{ userMessageCount }}/20</span> ·
          <span>Score: {{ score }}</span> ·
          <span>Game: {{ gameNumber }}</span> ·
          <span>Highest: {{ highestScore }}<span v-if="highestScoreGame"> (Game {{ highestScoreGame }})</span></span>
        </div>
      </div>

      <!-- Welcome state -->
      <Motion v-else :initial="{ opacity: 0, y: 30, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :transition="{ duration: 0.8, delay: 0.3 }">
        <div class="chat-welcome">
          <h3 class="welcome-message">Hello! How can I help you today?</h3>
        </div>
      </Motion>
    </div> <!-- /chat-content -->

    <!-- 💬 Input -->
    <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.4 }">
      <div class="chat-input-container">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="Send a message"
            class="message-input"
            v-model="messageText"
            @keyup.enter="sendMessage"
          />
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
import { ref, onMounted } from "vue";
import { Motion } from "motion-v";
import axios from "axios";
import { useGameStore } from "../store/gameStore";
import { storeToRefs } from "pinia";

const gameStore = useGameStore();
const { userMessageCount, score, gameNumber, highestScore, highestScoreGame, showQuiz, currentQuestion, quizOptions } =
  storeToRefs(gameStore);

const messageText = ref("");
const isLoading = ref(false);
const messages  = ref([]);

onMounted(() => {
  // expose for quick debugging if needed
  window.gameStore = gameStore;
});

const toggleSidebar = () => {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  if (sidebar && mainContent) {
    sidebar.classList.toggle("isOpen");
    mainContent.classList.toggle("hide");
  }
};

const selectAnswer = (option) => {
  const correct = option === gameStore.correctAnswer;
  gameStore.checkAnswer(option);
  messages.value.push({
    id: messages.value.length + 1,
    text: correct ? "✅ Correct!" : `❌ Wrong! The correct answer was: ${gameStore.correctAnswer}`,
    sender: "bot",
    timestamp: new Date(),
  });
};

const sendMessage = async () => {
  if (!messageText.value.trim()) return;

  // push user message
  messages.value.push({
    id: messages.value.length + 1,
    text: messageText.value,
    sender: "user",
    timestamp: new Date(),
  });

  // game counters
  gameStore.incrementMessageCount();

  // new game message after reset
  if (gameStore.userMessageCount === 0 && gameStore.gameNumber > 1) {
    messages.value = [{
      id: 1,
      text: `🎮 New Game #${gameStore.gameNumber} started! Highest score so far: ${gameStore.highestScore}` +
            (gameStore.highestScoreGame ? ` (Game ${gameStore.highestScoreGame})` : ""),
      sender: "bot",
      timestamp: new Date(),
    }];
  }

  // call backend
  isLoading.value = true;
  const question = messageText.value;
  messageText.value = "";

  try {
    const { data } = await axios.post("http://localhost:8000/ask", { question });
    const botAnswer = data?.answer || "Sorry, I couldn't get a response.";
    messages.value.push({
      id: messages.value.length + 1,
      text: botAnswer,
      sender: "bot",
      timestamp: new Date(),
    });
  } catch (e) {
    console.error(e);
    messages.value.push({
      id: messages.value.length + 1,
      text: "Error contacting API.",
      sender: "bot",
      timestamp: new Date(),
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<!-- Uses your existing CSS files for look & feel -->
<style scoped src="../styles/chat.css"></style>
<style scoped src="../styles/chatMessages.css"></style>
<style scoped src="../styles/animation.css"></style>

<!-- Small overrides to ensure readable quiz/score -->
<style scoped>
.quiz-box {
  background-color: #f8f8f8;
  color: #111;
  padding: 15px;
  border-radius: 10px;
  margin: 10px 70px 0 70px; /* align with chat padding */
  border: 1px solid #ddd;
  text-align: center;
}
.quiz-box h3 { margin-bottom: 10px; color:#000; }
.quiz-box button {
  margin: 5px;
  background-color: #8b1538; /* NMSU crimson */
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.quiz-box button:hover { background-color: #a91b47; }

.score-info {
  margin: 8px 70px 0 70px;  /* align with chat padding */
  padding: 8px 0;
  font-size: 13px;
  color: #111;
  border-top: 1px solid #eee;
}
@media (max-width: 768px) {
  .quiz-box, .score-info { margin: 10px 16px 0 16px; }
}
</style>
