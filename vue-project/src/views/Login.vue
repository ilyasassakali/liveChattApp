<template>
    <div class="center-content">
      <div class="home-content">
        <div class="live-indicator-container">
                <div class="live-users-indicator"></div>
                <h1>LiveConnectRooms</h1>
        </div>       
        <form @submit.prevent="handleSubmit">
            <div class="home-content">
                <h2>Log In</h2>
                      <div class="error-message" v-if="showErrorMessage">
                        Incorrect username or password.
                      </div>
                    <div class="input-group mb-3">
                      <input v-model="username" type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                      <input v-model="password" type="password" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1">
                    </div>
                    <button type="submit" class="btn btn-primary">Log In</button>
                    <p>Not a member? <router-link to="/register">Register</router-link></p>
            </div>
        </form>
      </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      showErrorMessage: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post(import.meta.env.VITE_SOCKET_URL+"login", {
          username: this.username,
          password: this.password
        });
        if (response.status === 200) {
          this.$router.push("/");
          const user = response.data.user;
          //console.log("Ingelogde gebruiker:", user);
          sessionStorage.setItem("user", JSON.stringify(user));

          const sessionInfo = await axios.get(import.meta.env.VITE_SOCKET_URL+"get-session");
          sessionStorage.setItem("sessionInfo", JSON.stringify(sessionInfo));
          //console.log("Sessie-informatie:", sessionInfo.data);
        }
      } catch (error) {
        this.showErrorMessage = true; 
        //console.log(error);
      }
    }
  }
};

</script>

<style  scoped>

.error-message {
  color: red;
}

h1{
    color: #5468ff;
}

button{
    background-color: #5468ff;
    width: 100px;
    margin: 20px 0;
}

button:hover{
    background-color: #2942ff;
}

.input-group{
    width: 300px;
    margin: 30px;
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