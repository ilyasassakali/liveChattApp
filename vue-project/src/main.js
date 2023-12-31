import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import axios from "axios";

import LiveUsers from "./views/LiveUsers.vue";
import Home from "./views/Home.vue";
import Chat from "./views/Chat.vue";
import UsersList from "./views/UsersList.vue";

import Register from "./views/Register.vue";
import Login from "./views/Login.vue";

const app = createApp(App);

app.config.globalProperties.$axios = axios.create({
  baseURL: "http://localhost:3000",
});

const routes = [
  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/liveUsers", component: LiveUsers, meta: { requiresAuth: true } },
  {
    path: "/chat/:roomName",
    name: "room",
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: "/usersList",
    component: UsersList,
    meta: { requiresAuth: true, requiresAdmin: true },
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user && user.isAdmin) {
        next();
      } else {
        next({ path: "/" });
      }
    },
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const sessionInfo = JSON.parse(sessionStorage.getItem("sessionInfo"));
    if (sessionInfo) {
      const expires = new Date(sessionInfo.data.cookie.expires);
      const now = new Date();
      if (now > expires) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("sessionInfo");
        sessionStorage.removeItem("currentUser");
      }
    }

    if (!user) {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

createApp(App).use(router).mount("#app");
