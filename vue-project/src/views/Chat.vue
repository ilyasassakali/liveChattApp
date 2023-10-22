<template>
  
  <div class="center-content">
    <h1>Chat Room: {{ roomName }}</h1>

    <div class="list-container" ref="listContainer">
      <div v-for="message in messages" :key="message.id">
        <b>{{ message.user }}:</b> {{ message.text }}
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
      socketInstance: null
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
  },
  methods: {
    join() {
      this.socketInstance = io("https://live-chatt-app.vercel.app/");
      this.socketInstance.emit('join', this.roomName);
      this.socketInstance.on(
        "message:received", (data) => {
          this.messages = this.messages.concat(data);
          this.scrollToBottom();
        }
      )
    },
    sendMessage() {
      this.addMessage();
      this.text = "";
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
  height:80vh; 
  overflow-y: auto; 
  
  padding: 10px; 
}


.input-group{
  position: fixed;
  bottom: 10px;
  width: 80%;
}

</style>
