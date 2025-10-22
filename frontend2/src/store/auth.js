import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    // Cargar datos de autenticación desde localStorage
    loadFromLocalStorage() {
      try {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('auth_user');
        
        if (token && user) {
          this.token = token;
          this.user = JSON.parse(user);
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Error loading auth data from localStorage:', error);
        this.clearAuth();
      }
    },

    // Guardar datos de autenticación en localStorage
    saveToLocalStorage() {
      try {
        if (this.token) {
          localStorage.setItem('auth_token', this.token);
        }
        if (this.user) {
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }
      } catch (error) {
        console.error('Error saving auth data to localStorage:', error);
      }
    },

    // Limpiar datos de autenticación
    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },

    // Iniciar sesión
    async login(username, password) {
      this.loading = true;
      try {
        const response = await fetch('http://127.0.0.1:8000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al iniciar sesión');
        }

        const data = await response.json();
        
        // Simular token
        this.token = `token_${Date.now()}`;
        this.user = { username, ...data };
        this.isAuthenticated = true;
        
        this.saveToLocalStorage();
        return { success: true, message: 'Inicio de sesión exitoso' };
        
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Registro de usuario
    async register(username, password) {
      this.loading = true;
      try {
        const response = await fetch('http://127.0.0.1:8000/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al registrar usuario');
        }

        const data = await response.json();
        return { success: true, message: data.message };
        
      } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Cerrar sesión
    logout() {
      this.clearAuth();
    },

    // Inicializar store al cargar la aplicación
    initialize() {
      this.loadFromLocalStorage();
    }
  },
});
