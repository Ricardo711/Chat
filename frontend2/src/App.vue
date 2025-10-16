
<template>
  <router-view></router-view>
</template>

<script setup>
import { useAuthStore } from './store/auth';
const auth = useAuthStore();
auth.loadFromLocalStorage();
</script>

