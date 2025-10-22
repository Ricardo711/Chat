import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./store/auth";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Toast, {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
});

const authStore = useAuthStore();
authStore.initialize();

router.afterEach((to) => {
  document.title = to.meta.title || "Meat-Science-Instructor-NMSU";
});

app.use(router);

app.mount("#app");
