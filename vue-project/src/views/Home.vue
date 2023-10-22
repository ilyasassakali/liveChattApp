<template>
    <div class="center-content">
      <div class="home-content">
              <h1 >LiveConnectRooms</h1>
              <h1 > {{ testText }}</h1>
              <p>Enter username to create or join a Room and chat with people!</p>
        <div class="input-group mb-3">
                  <input v-model="username" type="text" @keyup.enter="goLive"  class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                  <button  type="button" class="btn btn-success" @click="goLive">Go Live</button>
              </div>
              <div style="background-color: white; color: #5468ff;border: 2px solid #5468ff;" class="alert alert-warning" role="alert" v-if="usernameExists || usernameTaken">
          {{ usernameExists ? 'Username already taken! Use another username.' : 'Username is already taken! Use another username.' }}
        </div>
      </div>
    </div>
</template>

<script>
import io from "socket.io-client";
console.log("show");
console.log(import.meta.env.VITE_SOCKET_URL);
const socket = io(import.meta.env.VITE_SOCKET_URL);

export default {
  data() {
    return {
      username: "",
      usernameExists: false, // New data property to track if the username already exists
      usernameTaken: false,
      testText: import.meta.env.VITE_TEST_NAME,
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

h1{
    color: #5468ff;
}

button{
    background-color: #5468ff;
}

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