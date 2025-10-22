<template>
  <div class="w-full">
    <div class="form-header">
      <h1>Log In</h1>
      <p>Enter your credentials to access</p>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
          :disabled="loading"
          placeholder="Enter your username"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          :disabled="loading"
          placeholder="Enter your password"
        />
      </div>


      <button type="submit" :disabled="loading" class="submit-button">
        <span v-if="loading">Logging in...</span>
        <span v-else>Log In</span>
      </button>
    </form>

    <div class="form-footer">
      <p>
        Don't have an account?
        <router-link to="/register" class="link">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useToast } from 'vue-toastification';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    
    const form = ref({
      username: '',
      password: ''
    });
    
    const loading = ref(false);

    const handleLogin = async () => {
      if (!form.value.username || !form.value.password) {
        toast.error('Please fill in all fields');
        return;
      }

      loading.value = true;

      try {
        const result = await authStore.login(form.value.username, form.value.password);
        
        if (result.success) {
          toast.success('Login successful!');
          router.push('/');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error logging in. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      handleLogin
    };
  }
};
</script>

<style scoped src="../../styles/formsAuth.css" />