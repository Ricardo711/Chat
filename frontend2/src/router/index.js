import { createRouter, createWebHistory } from "vue-router";


// layout y vistas
import AdminLayout from "../layout/AdminLayout.vue";
import InicioView from "../views/InicioView.vue";
import ChatView from "../views/ChatView.vue";

const routes = [
  {
    path: "/",
    name: "AdminLayout",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "Inicio",
        component: InicioView,
        meta: {
          title: "Nuevo Chat",
        },
      },
      {
        path: "/chat",
        name: "Chat",
        component: ChatView,
        meta: {
          title: "Chat",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
