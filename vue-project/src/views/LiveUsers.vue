<template>
    <div>
        <h1>Live Users</h1>
        <ul>
          <li v-for="(user, index) in liveUsers" :key="index">{{ user }}</li>
        </ul>
    </div>
  </template>
  
  <script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      liveUsers: [], // Voeg liveUsers toe
    };
  },
  mounted() {
    // Request the list of live users when the component mounts
    socket.emit('get live users');
    
    // Step 4: Receive the list of live users from the server
    socket.on("update live users", (liveUsers) => {
      this.liveUsers = liveUsers;
    });
  },
};
  </script>
  
  <style scoped>
  
  </style>
  