import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

// layout y vistas
import AdminLayout from "../layout/AdminLayout.vue";
import InicioView from "../views/InicioView.vue";
import ChatView from "../views/ChatView.vue";

// vistas de autenticación
import AuthLayout from "../layout/AuthLayout.vue";
import LoginView from "../views/Auth/LoginView.vue";
import RegisterView from "../views/Auth/RegisterView.vue";


const routes = [
  {
    path: "/",
    name: "AdminLayout",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Inicio",
        component: InicioView,
        meta: {
          title: "Nuevo Chat",
          requiresAuth: true,
        },
      },
      {
        path: "/chat",
        name: "Chat",
        component: ChatView,
        meta: {
          title: "Chat",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/auth",
    name: "AuthLayout",
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      { 
        path: "/login", 
        name: "Login", 
        component: LoginView,
        meta: { requiresGuest: true }
      },
      { 
        path: "/register", 
        name: "Register", 
        component: RegisterView,
        meta: { requiresGuest: true }
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.isAuthenticated) {
    authStore.initialize();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else if (requiresGuest && authStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
