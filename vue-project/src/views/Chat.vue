<template>
  <div>
    <h1>Chat Room: {{ roomName }}</h1>
    <div v-for="message in messages" :key="message.id">
      <b>{{ message.user }}:</b> {{ message.text }}
    </div>
    <input v-model="messageInput" @keyup.enter="sendMessage" />
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      roomName: this.$route.params.roomName,
      messages: [],
      messageInput: "",
      currentUser: sessionStorage.getItem('currentUser') || ''
    };
  },
  methods: {
    sendMessage() {
      const content = this.messageInput.trim();
      if (content !== "") {
        const message = {
          text: content,
          user: this.currentUser,
        };
        this.messages.push(message);
        socket.emit("chat message", content, this.roomName, this.currentUser);
        this.messageInput = "";
      }

    },
    updateMessages(content, sender, user) {
      const message = {
        text: content,
        user: sender,
      };
      this.messages.push(message);
    },
  },
  mounted() {
    socket.on("chat message", (msg, sender, targetRoom, user) => {
      if (targetRoom === this.roomName) {
        this.updateMessages(msg, sender, user);
      }
    });
  },
};
</script>

<style scoped>
.parent-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  padding-top: 150px;
}

.name-container {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.user-name {
  height: 30px;
  font-size: 20px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  font-weight: bold;
  display: block;
}

.text-input-container {
  height: 100vh;
}

.text-message {
  width: 100%;
  position: absolute;
  bottom: 0px;
  height: 70px;
  padding: 10px;
  box-sizing: border-box;
}
</style>
