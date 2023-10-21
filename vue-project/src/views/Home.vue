<template>
    <div class="center-content">
      <div class="home-content">
              <h1>ChatApp</h1>
              <p>Enter username to create or join a Room and chat with them!</p>
        <div class="input-group mb-3">
                  <input v-model="username" type="text" @keyup.enter="goLive"  class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                  <button type="button" class="btn btn-success" @click="goLive">Go Live</button>
              </div>
              <div class="alert alert-warning" role="alert" v-if="usernameExists || usernameTaken">
          {{ usernameExists ? 'Username already taken! Use another username.' : 'Username is already taken! Use another username.' }}
        </div>
      </div>
    </div>
</template>

<script>
import io from "socket.io-client";
const io = new Server(server, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter(),
  });
const socket = io.connect("https://live-chatt-app-backend-dmdqyvqu0-ilyasassakalis-projects.vercel.app/");

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

<style scoped>

.center-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
}

.home-content {
  text-align: center;
  margin: 20px;
}

</style>