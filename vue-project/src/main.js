import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import LiveUsers from "./views/LiveUsers.vue";
import Home from "./views/Home.vue";
import Chat from "./views/Chat.vue";

import Register from "./views/Register.vue";
import Login from "./views/Login.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/liveUsers", component: LiveUsers },
  { path: "/chat/:roomName", name: "room", component: Chat },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
