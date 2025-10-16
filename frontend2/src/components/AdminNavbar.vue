<template>
    <div class="sidebar">
        <button class="menu-section-hide" @click="closeRightPanel">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="feather feather-x" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        </button>

        <!-- Header de la barra lateral -->
        <div class="sidebar-header">
            <button class="new-chat-btn justify-between" @click="router.push('/')">
                <div class="flex items-center gap-2">
                    <i class="bi bi-globe"></i>
                    <span>New Chat</span>
                </div>
                <i class="bi bi-pencil-square"></i>
            </button>
        </div>

        <!-- Buscador -->
        <div class="search-container">
            <div class="search-input-wrapper">
                <i class="bi bi-search"></i>
                <input type="text" placeholder="Search" class="search-input" />
            </div>
        </div>

        <!-- Lista de conversaciones -->
        <div class="conversations-list">
            <div class="conversation-item" @click="router.push('/chat')" :class="{ active: router.currentRoute.value.path === '/chat' }">
                <div class="conversation-icon">
                    <i class="bi bi-chat"></i>
                </div>
                <span class="conversation-text">What is the main topi...</span>
                <button class="conversation-menu">
                    <i class="bi bi-three-dots"></i>
                </button>
            </div>
            <div class="conversation-item" @click="router.push('/chat')" :class="{ active: router.currentRoute.value.path === '/chat' }">
                <div class="conversation-icon">
                    <i class="bi bi-chat"></i>
                </div>
                <span class="conversation-text">Why is the sky blue?</span>
                <button class="conversation-menu">
                    <i class="bi bi-three-dots"></i>
                </button>
            </div>
        </div>

        <!-- Footer de la barra lateral -->
        <div class="sidebar-footer">
            <div class="flex gap-2 sm:flex-row flex-col">
                <button class="footer-btn">
                    <i class="bi bi-file-arrow-up"></i>
                    <span>Export</span>
                </button>
                <button class="footer-btn">
                    <i class="bi bi-file-arrow-down"></i>
                    <span>Import</span>
                </button>
            </div>
            <button class="footer-btn">
                <i class="bi bi-trash"></i>
                <span>Clear conversations</span>
            </button>
            <button class="footer-btn">
                <i class="bi bi-gear"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const closeRightPanel = () => {
    document.querySelector(".sidebar").classList.remove("isOpen");
    document.querySelector(".main-content").classList.remove("hide");
};
</script>