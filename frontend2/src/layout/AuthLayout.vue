<template>
    <div class="auth-container" :class="{ 'register-mode': isRegisterRoute }">
        <!-- Sección del formulario -->
        <motion.div 
            class="form-section"
            :initial="{ opacity: 0, x: isRegisterRoute ? -50 : 50 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }"
        >
            <div class="form-wrapper">
                <router-view />
            </div>
        </motion.div>

        <!-- Sección de la imagen -->
        <motion.div 
            class="image-section"
            :initial="{ opacity: 0, x: isRegisterRoute ? 50 : -50 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }"
        >
            <motion.div 
                class="image-content"
                :key="isRegisterRoute ? 'register' : 'login'"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.2 }"
            >
                <motion.div 
                    class="welcome-text"
                    :initial="{ scale: 0.9 }"
                    :animate="{ scale: 1 }"
                    :transition="{ duration: 0.3, delay: 0.3 }"
                >
                    <motion.h2 
                        :key="isLoginRoute ? 'welcome-back' : 'join-us'"
                        :initial="{ opacity: 0, y: 10 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.3 }"
                    >
                        {{ isLoginRoute ? 'Welcome back!' : 'Join us!' }}
                    </motion.h2>
                    <motion.p 
                        :key="isLoginRoute ? 'login-text' : 'register-text'"
                        :initial="{ opacity: 0, y: 10 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.3, delay: 0.1 }"
                    >
                        {{ isLoginRoute ? 'Log in to continue your experience.' : 'Create your account and start playing.' }}
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { motion } from 'motion-v';

const route = useRoute();

const isLoginRoute = computed(() => route.name === 'Login');
const isRegisterRoute = computed(() => route.name === 'Register');

// Watch para detectar cambios de ruta y animar la transición
watch(() => route.name, (newRoute, oldRoute) => {
  if (newRoute !== oldRoute) {
  }
});
</script>

<style scoped src="../styles/authLayout.css" />