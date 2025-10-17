import { defineStore } from "pinia";
import { nextTick } from "vue"; // 🟢 new import

export const useGameStore = defineStore("game", {
  state: () => ({
    userMessageCount: 0,
    score: 0,
    gameNumber: 1,
    highestScore: 0,
    highestScoreGame: null,
    showQuiz: false,
    currentQuestion: null,
    quizOptions: [],
    correctAnswer: null,
  }),

  actions: {
    async incrementMessageCount() {
      this.userMessageCount++;

      // 🟢 When it's time for a quiz, show it and WAIT one tick
      if (this.userMessageCount % 5 === 0 && this.userMessageCount <= 20) {
        this.generateQuiz();
        await nextTick(); // ensures quiz is rendered before anything else
        return; // stop here — don't trigger reset yet
      }

      // ❌ do NOT reset here; let checkAnswer handle it
    },

    generateQuiz() {
      this.showQuiz = true;
      this.currentQuestion = "What is the main function of DNA?";
      this.quizOptions = [
        "Store genetic information",
        "Provide cell energy",
        "Digest proteins",
        "Carry oxygen",
      ];
      this.correctAnswer = "Store genetic information";
    },

    async checkAnswer(answer) {
      if (answer === this.correctAnswer) {
        this.score++;
        if (this.score > this.highestScore) {
          this.highestScore = this.score;
          this.highestScoreGame = this.gameNumber;
        }
      }

      // hide quiz after answer
      this.showQuiz = false;

      // 🟢 ensure Vue updates before resetting
      await nextTick();

      // if game reached 20 messages, reset AFTER rendering
      if (this.userMessageCount >= 20) {
        setTimeout(() => {
          this.resetGame();
        }, 500);
      }
    },

    resetGame() {
      this.userMessageCount = 0;
      this.score = 0;
      this.gameNumber++;
      this.showQuiz = false;
    },
  },
});
