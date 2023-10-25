<template>
    <div class="center-content">
            <div class="home-content">
              <div class="live-indicator-container">
                <div class="live-users-indicator"></div>
                <h1>LiveConnectRooms</h1>
              </div>
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
const socket = io(import.meta.env.VITE_SOCKET_URL);

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

h1{
    color: #5468ff;
}

button{
    background-color: #5468ff;
}

button:hover{
    background-color: #2942ff;
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

.live-indicator-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-users-indicator {
  width: 20px;
  height: 20px;
  background-color: #5468ff; 
  border-radius: 50%;
  animation: blink 1s infinite alternate; 
  margin-right: 10px;
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

</style>