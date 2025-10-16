import { defineStore } from "pinia";

// Store simplificado - sin funcionalidad de autenticación
export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Mantenemos una estructura básica por compatibilidad
    id_usuario: 1,
    id_empleado: 1,
    token: "no-auth-required",
    permissions: [],
  }),

  getters: {
    // Siempre autenticado ya que no hay login
    isAuthenticated: () => true,
  },

  actions: {
    // Métodos vacíos por compatibilidad con componentes existentes
    loadFromLocalStorage() {
      // Sin funcionalidad
    },

    async login(email, password, router) {
      // Sin funcionalidad de login
      router.push("/");
    },

    logout(router) {
      // Sin funcionalidad de logout, solo redirige al inicio
      router.push("/");
    },
  },
});
