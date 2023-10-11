<template>
    <div>
        <h1>ChatApp</h1>
    <p>Enter username to create or join Room and chat with them!</p>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">@</span>
      <input v-model="username" type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
      <button type="button" class="btn btn-success" @click="goLive">Go Live</button>
    </div>
    </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      username: "", // Voeg dit toe aan de data om de gebruikersnaam bij te houden
      //liveUsers: [], // Voeg liveUsers toe
      //rooms: [] // Voeg rooms toe als lege array
    };
  },
  methods: {
    goLive() {
        // Step 2: Send the username to the server
        const username = this.username;
        socket.emit("user live", username);
        this.$router.push('/liveUsers'); // Navigate to liveUsers page
    },
  },
  mounted() {
  }
};
</script>

<style >

</style>