<template>
    <div>
        <h1>Hello {{ currentUser }}</h1>
        
        <div class="card" style="width: 18rem; margin-bottom: 20px;">

        <div class="card-body">
          <h3>Live Users</h3>
          <ul style="margin-bottom: 10px;" class="list-group">
            <li v-for="(user, index) in liveUsers" :key="index" class="list-group-item">
              {{ user }}
            </li>
          </ul>
        </div>
      </div>
        <h3>Join or Create Room</h3>
        <!--
        <div class="card" style="width: 18rem; margin-bottom: 20px;">
          <div class="card-body">
            <div class="input-group mb-3">
            <input v-model="newRoomName" @keyup.enter="createAndJoinRoom" type="text" class="form-control" placeholder="Enter roomname" aria-label="roomname" aria-describedby="basic-addon1">
          </div>
          <button class="btn btn-primary" @click="createAndJoinRoom">+ Create and join Room</button>
          </div>
        </div>-->

        <div v-for="(room, index) in rooms" :key="index" class="card" style="width: 18rem; margin-bottom: 20px;">
          <div class="card-body">
            <h5 class="card-title">{{ room.name }}</h5>
              <ul style="margin-bottom: 10px;" class="list-group">
                <li v-for="(user, index) in liveUsers" :key="index" class="list-group-item">{{ user }}</li>
              </ul>
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
      newRoomName: '',
      rooms: [
        { name: "Room101" },
        { name: "Roomtest" },
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
    createAndJoinRoom(){
        const roomName = this.newRoomName.trim()
        if (roomName !== "") {
        // Vérifiez si la salle n'existe pas déjà
        const roomExists = this.rooms.some(room => room.name === roomName);
        if (!roomExists) {
          this.rooms.push({ name: roomName });
        }
        this.joinRoom(roomName);
      }
    }
  },
};
  </script>
  
  <style scoped>
  
  </style>
  