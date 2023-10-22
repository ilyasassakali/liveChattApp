<template>
  
  <div class="center-content">
    <h1>Hello {{ currentUser }}</h1>
    <h2>Welcome to Room: {{ roomName }}</h2>

    <div v-if="liveUsersInRoom.length > 0" class="live-users-container">
      <div class="live-users-indicator"></div>
      <div class="live-users-info">
        <p>{{ liveUsersInRoom.length }} live user(s): {{ liveUsersInRoom.map(user => user.username).join(', ') }}</p>
      </div>
    </div>

    <div class="list-container" ref="listContainer">
      <div v-for="message in messages" :key="message.id">
        <b>{{ message.user === currentUser ? 'Me' : message.user }}:</b> {{ message.text }}
      </div>
    </div>

    <div class="input-group mb-3">
        <input v-model="text" v-on:keyup.enter="sendMessage" type="text" class="form-control" placeholder="Write here a message">
        <button @click="sendMessage" class="btn btn-outline-secondary" type="button" id="button-addon2">Send</button>
    </div>
 
  </div>
</template>

<script>

import io from "socket.io-client";

export default {
  data() {
    return {
      currentUser: sessionStorage.getItem('currentUser') || '',
      text: "",
      messages: [],
      roomName: this.$route.params.roomName,
      socketInstance: null,
      liveUsers: [],
      liveUsersInRoom: [] 
    };
  },
  created() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      this.$router.push('/'); // Rediriger vers la page d'accueil
    }
  },
  mounted() {
    this.join(); 
    this.getLiveUsers(); // Call this method to get live users

  },
  methods: {
    join() {
      this.socketInstance = io(import.meta.env.VITE_SOCKET_URL);
      this.socketInstance.emit('join', this.roomName);
      this.socketInstance.on(
        "message:received", (data) => {
          this.messages = this.messages.concat(data);
          this.scrollToBottom();
        }
      )
    },
    sendMessage() {
      if (this.text.trim() !== "") {
      this.addMessage();
      this.text = "";
      }
    },
    addMessage() {
      const message = {
        text: this.text,
        user: this.currentUser,
      };
      this.messages = this.messages.concat(message);
      this.socketInstance.emit('message', message, this.roomName);
      this.scrollToBottom();
    },
    scrollToBottom() {
    this.$nextTick(() => {
      this.$refs.listContainer.scrollTop = this.$refs.listContainer.scrollHeight;
    });
    },
    getLiveUsers() {
      this.socketInstance.emit('get live users');
      this.socketInstance.on("update live users", (liveUsers) => {
        this.liveUsersInRoom = liveUsers.filter(user => user.room === this.roomName);
      });
    }
    
  },
};
</script>

<style scoped>

.center-content{
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
 
}

.list-container {
  height:70vh; 
  overflow-y: auto; 
  
  padding: 10px; 
}

@media screen and (max-width: 768px) {
  .list-container {
    height: 60vh; /* Changez la hauteur pour les écrans de téléphone portable */
  }
}


.input-group{
  position: fixed;
  bottom: 10px;
  width: 80%;
}

h1,h5{
    color: #5468ff;
}

button{
    background-color: #5468ff;
    color: white;
}

button:hover{
    background-color: #2942ff;
}


.live-users-indicator {
  width: 10px;
  height: 10px;
  background-color: #5468ff; /* You can change the color as needed */
  border-radius: 50%;
  animation: blink 1s infinite alternate; /* Define the blink animation */
  margin-bottom: 5px;
}

@keyframes blink {
  0% {
    opacity: 0; /* Hide the element at the start */
  }
  100% {
    opacity: 1; /* Show the element at the end */
  }
}

.live-users-container {
  display: flex;
  align-items: center;
}

.live-users-info {
  text-align: center;
  margin-top: 10px;
  margin-left: 5px;
}

</style>
