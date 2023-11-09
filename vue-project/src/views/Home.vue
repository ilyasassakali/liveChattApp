<template>
    <div class="center-content">
            <div class="home-content">
              <div class="live-indicator-container">
                <div class="live-users-indicator"></div>
                <h1>LiveConnectRooms</h1>
              </div>

              <p v-if="isAdmin">
                Go live to create/delete, join a Room and chat with people!
              </p>
              <p v-else>
                Go live to create or join a Room and chat with people!
              </p>
              
              <div class="input-group mb-3">
                  <input readonly v-model="username" type="text" @keyup.enter="goLive"  class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                  <button  type="button" class="btn btn-success" @click="goLive">Go Live</button>
              </div>    
      </div>
        <img v-if="isAdmin" @click="goUsersPage" class="users-button" src="../images/group.png">
        <img @click="logout" class="logout-button" src="../images/logout.png">
    </div>
</template>

<script>
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL);

export default {
  data() {
    return {
      username: "",
      currentUser: "", // Ajoutez cette ligne pour stocker le nom de l'utilisateur
      usernameExists: false, // New data property to track if the username already exists
      usernameTaken: false,
      isAdmin: false,
    };
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.username = user.username;
      console.log("Ingelogde gebruiker:", this.username);
      this.isAdmin = user.isAdmin; 
    }
  },
  methods: {
    goLive() {
      const username = this.username;
      if (username.trim() !== "") {
        const username = this.username;
        this.currentUser = username;
        sessionStorage.setItem('currentUser', username);
        /*socket.emit("check username", username, (exists) => {

          if (!exists) {
            this.usernameExists = false;
            this.usernameTaken = false; // Réinitialiser le drapeau usernameTaken
            socket.emit("user live", username);
            this.$router.push('/liveUsers');
          } else {
            this.usernameExists = true;
            this.usernameTaken = false; // Réinitialiser le drapeau usernameTaken
            this.$router.push('/login');
            sessionStorage.removeItem("user");
        sessionStorage.removeItem("sessionInfo");
        sessionStorage.removeItem("currentUser");
          }
        });*/
      }
        socket.emit("user live", username);
        this.$router.push('/liveUsers');
    },
    logout(){
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("sessionInfo");
      sessionStorage.removeItem("currentUser");
      this.$router.push("/login");
      location.reload();
    },
    goUsersPage(){
      this.$router.push('/usersList');
    }
  },

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

.users-button{
  position: fixed;
  bottom: 20px;
  right: 100px;
  width: 50px;
  border: none;
  cursor: pointer;
  background-color: #5468ff;
  padding: 5px;
  border-radius: 5px;
}


.logout-button:hover,.users-button:hover {
  background-color: #2942ff;
}



</style>