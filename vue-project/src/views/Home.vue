<template>
    <div>
        <h1>ChatApp</h1>
        <p>Enter username to create or join a Room and chat with them!</p>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1" >@</span>
            <input v-model="username" type="text" @keyup.enter="goLive"  class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
            <button type="button" class="btn btn-success" @click="goLive">Go Live</button>
        </div>
        <div class="alert alert-warning" role="alert" v-if="usernameExists">
            Username already taken! Use another username.
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
      currentUser: "" // Ajoutez cette ligne pour stocker le nom de l'utilisateur
    };
  },
  created() {
    /*
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.$router.push('/liveUsers'); // Rediriger vers la page LiveUsers
    }*/
  },
  /*
  beforeDestroy() {
    const username = sessionStorage.getItem('currentUser');
    if (username) {
      socket.emit("disconnect", username); // Informer le serveur que l'utilisateur a quitté
      const index = this.liveUsers.indexOf(username);
      if (index !== -1) {
        this.liveUsers.splice(index, 1);
      }
    }
  },*/
  methods: {
    goLive() {
        const username = this.username;
        if (username.trim() !== "") { // Ensure username is not empty
        this.currentUser = username; // Définissez currentUser avec le nom de l'utilisateur
        sessionStorage.setItem('currentUser', username); // Ajouter cette ligne pour stocker le nom d'utilisateur
        socket.emit("check username", username, (exists) => {
          if (!exists) {
            this.usernameExists = false; // Reset the usernameExists flag
            socket.emit("user live", username);
            this.$router.push('/liveUsers'); // Navigate to liveUsers page
          } else {
            this.usernameExists = true; // Set usernameExists flag if the username already exists
          }
        });
      }
    },
  }
};
</script>

<style >
</style>