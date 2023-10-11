import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import LiveUsers from "./views/LiveUsers.vue";
import Home from "./views/Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/liveUsers", component: LiveUsers },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
