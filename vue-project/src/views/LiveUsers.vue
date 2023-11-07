<template>
    <div class="center-content">
      
        <h1>Hello {{ currentUser }}</h1>


        <h3>Join or Create Room</h3>

      <div class="rooms">

        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Your created roomname</h5>
            <div class="input-group mb-3">
            <input v-model="newRoomName" @keyup.enter="createAndJoinRoom" type="text" class="form-control" placeholder="Enter roomname" aria-label="roomname" aria-describedby="basic-addon1">
          </div>
          <button class="btn btn-primary" @click="createAndJoinRoom">+ Create and join Room</button>
          </div>
        </div>

        <div v-for="(room, index) in liveRooms" :key="index" class="card" :class="{ 'has-users': getLiveUsersByRoom(room.name).length > 0 }">
          <div class="card-body" >
            <h5 class="card-title">{{ room.name }}</h5>
              <ul style="margin-bottom: 10px;" class="list-group">
                <li v-for="(user, index) in getLiveUsersByRoom(room.name)" :key="index" class="list-group-item">{{ user.username }}</li>
              </ul>
            <button class="btn btn-primary" @click="joinRoom(room.name)">{{ isUserInRoom(room.name) ? 'Joined Room' : 'Join Room' }}</button>
          </div>
        </div>
      </div>
      <img @click="logout" class="logout-button" src="../images/logout.png">
    </div>
  </template>
  
  <script>
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL);

export default {
  data() {
    return {
      liveUsers: [], // Voeg liveUsers toe
      currentUser: sessionStorage.getItem('currentUser') || '', // Ajouter cette ligne pour récupérer le nom d'utilisateur
      newRoomName: '',
      liveRooms: [],
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
    },
    isUserInRoom(roomName) {
    const username = this.currentUser;
    return this.getLiveUsersByRoom(roomName).some(user => user.username === username);
  },logout(){
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("sessionInfo");
      sessionStorage.removeItem("currentUser");
      this.$router.push("/login");
      location.reload();
    }
  },
};
  </script>
  
  <style scoped>

h1,h5{
    color: #5468ff;
}

button{
    background-color: #5468ff;
}

button:hover{
    background-color: #2942ff;
}

.center-content{
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
}

.rooms {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 90%;

}

.card {
  border: 3px solid #5468ff;
  width: 18rem;
  margin: 10px;
}

.list-group-item{
  background-color: transparent;
  color: white;
}

.has-users {
  animation: spin 1.2s infinite linear;
}

@keyframes spin {
  20% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
}


.logout-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  border: none;
  cursor: pointer;
  background-color: #5468ff;
  
  padding: 5px;
  border-radius: 5px;
}


.logout-button:hover {
  background-color: #2942ff;
}

  </style>
  