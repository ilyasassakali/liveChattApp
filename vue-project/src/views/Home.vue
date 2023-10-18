<template>
    <div>
        <h1>ChatApp</h1>
        <p>Enter username to create or join a Room and chat with them!</p>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1" >@</span>
            <input v-model="username" type="text" @keyup.enter="goLive"  class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
            <button type="button" class="btn btn-success" @click="goLive">Go Live</button>
        </div>
        <div class="alert alert-warning" role="alert" v-if="usernameExists || usernameTaken">
    {{ usernameExists ? 'Username already taken! Use another username.' : 'Username is already taken! Use another username.' }}
  </div>
    </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      username: "",
      usernameExists: false, // New data property to track if the username already exists
      usernameTaken: false,

      currentUser: "" // Ajoutez cette ligne pour stocker le nom de l'utilisateur
    };
  },
  methods: {
    goLive() {
      const username = this.username;
      if (username.trim() !== "") {
        this.currentUser = username;
        sessionStorage.setItem('currentUser', username);
        socket.emit("check username", username, (exists) => {
          if (!exists) {
            this.usernameExists = false;
            this.usernameTaken = false; // Réinitialiser le drapeau usernameTaken
            socket.emit("user live", username);
            this.$router.push('/liveUsers');
          } else {
            this.usernameExists = true;
            this.usernameTaken = false; // Réinitialiser le drapeau usernameTaken
          }
        });
      }
    },
  }
};
</script>

<style >
</style>