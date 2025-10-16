import { defineStore } from "pinia";

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
    incrementMessageCount() {
      this.userMessageCount++;
      if (this.userMessageCount % 5 === 0) {
        this.generateQuiz();
      }

      if (this.userMessageCount >= 20) {
        this.resetGame();
      }
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

    checkAnswer(answer) {
      if (answer === this.correctAnswer) {
        this.score++;
        if (this.score > this.highestScore) {
          this.highestScore = this.score;
          this.highestScoreGame = this.gameNumber;
        }
      }
      this.showQuiz = false;
    },

    resetGame() {
      this.userMessageCount = 0;
      this.score = 0;
      this.gameNumber++;
      this.showQuiz = false;
    },
  },
});
