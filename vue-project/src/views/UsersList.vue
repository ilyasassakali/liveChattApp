<template>
    <div class="center-content">
      <div class="home-content">
        <h2>Delete Users</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ user.username }}</td>
              <td>
                <button @click="deleteUser(user._id)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <img @click="logout" class="logout-button" src="../images/logout.png">
    </div>
  </template>

<script>
import axios from 'axios';
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL);


export default {
  data() {
    return {
      isAdmin: false,
      users: [],
    };
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.username = user.username;
      //.log("Ingelogde gebruiker:", this.username);
      this.isAdmin = user.isAdmin; 
    }
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
    try {
      const response = await axios.get('https://livechatbackend.onrender.com/get-all-users'); 
      this.users = response.data; 
    } catch (error) {
     // console.error(error);
    }
    },
    logout(){
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("sessionInfo");
      sessionStorage.removeItem("currentUser");
      this.$router.push("/login");
      location.reload();
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`https://livechatbackend.onrender.com/delete-user/${userId}`);
        this.fetchUsers(); // Mettez à jour la liste des utilisateurs après la suppression
      } catch (error) {
        //console.error(error);
      }
    }
  },

};
</script>

<style scoped>

tr:nth-child(odd) {
    background-color: transparent;
    color: white;
    }

   tr:nth-child(even) {
    background-color: transparent;
    color: white;
    }

    th,td {
       background-color: transparent;
       color: white;
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


.home-content {
  text-align: center;
  margin: 20px;
}

.table {
  width: 80%;
  margin: 0 auto;
}

.table th, .table td {
  vertical-align: middle;
  text-align: center;
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

.logout-button:hover {
  background-color: #2942ff;
}
</style>