<template>
    <div class="app-container">
        <!--<AdminNavbar />-->
        <div class="main-content">
            <router-view />
        </div>
    </div>
</template>
<script setup>
import AdminNavbar from '../components/AdminNavbar.vue';
</script>

<style src="../styles/mainLayout.css"></style>