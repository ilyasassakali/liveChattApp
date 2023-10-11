<template>
    <div>
        <h1>Hello {{ currentUser }}</h1>


        <h3>Live Users</h3>
        <ul>
          <li v-for="(user, index) in liveUsers" :key="index">
            {{ user }}
          </li>
        </ul>

        <h3>Join Existing Rooms</h3>
        <div v-for="(room, index) in rooms" :key="index" class="card" style="width: 18rem; margin-bottom: 20px;">
          <div class="card-body">
            <h5 class="card-title">{{ room.name }}</h5>
            <button class="btn btn-primary" @click="joinRoom(room.name)">Join Room</button>
          </div>
        </div>
        
    </div>
  </template>
  
  <script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      liveUsers: [], // Voeg liveUsers toe
      currentUser: sessionStorage.getItem('currentUser') || '', // Ajouter cette ligne pour récupérer le nom d'utilisateur
      rooms: [
        { name: "Room101" },
        { name: "PokéCenter" },
        // Ajoutez d'autres rooms au besoin
      ]
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
  methods: {
    joinRoom(roomName) {
      this.$router.push({ name: 'room', params: { roomName } });
    },
  },
};
  </script>
  
  <style scoped>
  
  </style>
  