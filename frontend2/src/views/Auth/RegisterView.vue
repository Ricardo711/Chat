<template>
  <div class="w-full">
    <div class="form-header">
      <h1>Create Account</h1>
      <p>Register to start using the application</p>
    </div>

    <form @submit.prevent="handleRegister" class="form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
          :disabled="loading"
          placeholder="Choose a username"
          minlength="3"
        />
      </div>

      <div class="password-grid">
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              required
              :disabled="loading"
              placeholder="Create a secure password"
              minlength="6"
            />
          </div>
    
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              :disabled="loading"
              placeholder="Confirm your password"
            />
          </div>
      </div>


      <button type="submit" :disabled="loading" class="submit-button">
        <span v-if="loading">Creating account...</span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <div class="form-footer">
      <p>
        Already have an account?
        <router-link to="/login" class="link">
          Log in here
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
  name: 'RegisterView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    
    const form = ref({
      username: '',
      password: '',
      confirmPassword: ''
    });
    
    const loading = ref(false);

    const validateForm = () => {
      if (!form.value.username || !form.value.password || !form.value.confirmPassword) {
        toast.error('Please fill in all fields');
        return false;
      }

      if (form.value.username.length < 3) {
        toast.error('The username must have at least 3 characters');
        return false;
      }

      if (form.value.password.length < 6) {
        toast.error('The password must have at least 6 characters');
        return false;
      }

      if (form.value.password !== form.value.confirmPassword) {
        toast.error('The passwords do not match');
        return false;
      }

      return true;
    };

    const handleRegister = async () => {
      if (!validateForm()) {
        return;
      }

      loading.value = true;

      try {
        const result = await authStore.register(form.value.username, form.value.password);
        
        if (result.success) {
          toast.success(result.message);
          // Limpiar el formulario
          form.value = {
            username: '',
            password: '',
            confirmPassword: ''
          };
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error creating the account. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      handleRegister
    };
  }
};
</script>

<style scoped src="../../styles/formsAuth.css" />