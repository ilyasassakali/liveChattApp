<template>
    <div>
        <h1>Hello {{ currentUser }}</h1>

        <!--
        
        <div class="card" style="width: 18rem; margin-bottom: 20px;">
        <div class="card-body">
          <h3>Live Users</h3>
          <ul style="margin-bottom: 10px;" class="list-group">
            <li v-for="(user, index) in liveUsers" :key="index" class="list-group-item">
              {{ user.username }}
            </li>
          </ul>
        </div>
      </div>-->


        <h3>Join or Create Room</h3>
        
        <div class="card" style="width: 18rem; margin-bottom: 20px;">
          <div class="card-body">
            <div class="input-group mb-3">
            <input v-model="newRoomName" @keyup.enter="createAndJoinRoom" type="text" class="form-control" placeholder="Enter roomname" aria-label="roomname" aria-describedby="basic-addon1">
          </div>
          <button class="btn btn-primary" @click="createAndJoinRoom">+ Create and join Room</button>
          </div>
        </div>

        <div v-for="(room, index) in liveRooms" :key="index" class="card" style="width: 18rem; margin-bottom: 20px;">
          <div class="card-body">
            <h5 class="card-title">{{ room.name }}</h5>
              <ul style="margin-bottom: 10px;" class="list-group">
                <li v-for="(user, index) in getLiveUsersByRoom(room.name)" :key="index" class="list-group-item">{{ user.username }}</li>
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
      liveRooms: []
    };
  },
  mounted() {
    // Request the list of live users when the component mounts
    socket.emit('get live users');
    
    // Step 4: Receive the list of live users from the server
    socket.on("update live users", (liveUsers) => {
      this.liveUsers = liveUsers;
    });

    // Écoutez les mises à jour en direct des salles
    socket.on("update live rooms", (liveRooms) => {
      this.liveRooms = liveRooms;
    });

  },
  methods: {
    joinRoom(roomName) {
      const username = this.currentUser;

      // Supprimer l'ancienne entrée de l'utilisateur de liveUsers
      this.liveUsers = this.liveUsers.filter(user => user.username !== username);


      socket.emit('user live', { username, room: roomName });
      this.$router.push({ name: 'room', params: { roomName } });
    },
    createAndJoinRoom(){
        const roomName = this.newRoomName.trim()
        if (roomName !== "") {
        // Vérifiez si la salle n'existe pas déjà
        const roomExists = this.liveRooms.some(room => room.name === roomName);
        if (!roomExists) {
          this.liveRooms.push({ name: roomName });
        }
        this.joinRoom(roomName);
      }
    },
    getLiveUsersByRoom(roomName) {
      return this.liveUsers.filter(user => user.room === roomName);
    }
  },
};
  </script>
  
  <style scoped>
  
  </style>
  