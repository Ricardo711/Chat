import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

router.afterEach((to) => {
  document.title = to.meta.title || "Meat-Science-Instructor-NMSU";
});

app.use(router);

app.mount("#app");
