<template>
  <div>
    <h1>ChatApp</h1>
    <p>Enter username to create or join Room and chat with them!</p>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">@</span>
      <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
    </div>

    <h3>Create Room</h3>

    <div class="card" style="width: 18rem; margin-bottom: 20px;">
      <div class="card-body">
        <input type="text" class="form-control" placeholder="Room Name" aria-label="RoomName" style="margin-bottom: 10px;">
        <a href="#" class="btn btn-primary">+ Create Room</a>
      </div>
    </div>

    <h3>Join Existing Rooms</h3>

    <div v-for="(room, index) in rooms" :key="index" class="card" style="width: 18rem; margin-bottom: 20px;">
      <div class="card-body">
        <h5 class="card-title">{{ room.name }}</h5>
        <ul style="margin-bottom: 10px;" class="list-group">
          <li v-for="(user, userIndex) in room.users" :key="userIndex" class="list-group-item">{{ user.name }}</li>
        </ul>
        <a href="#" class="btn btn-primary">Join Room</a>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [
        {
          name: 'Room 101',
          users: [
            { name: 'User 1' },
            { name: 'User 2' },
            { name: 'User 3' }
          ]
        },
        {
          name: 'Room 102',
          users: [
            { name: 'User A' },
            { name: 'User B' },
            { name: 'User C' }
          ]
        },
        {
          name: 'Room 103',
          users: [
            { name: 'User X' },
            { name: 'User Y' },
            { name: 'User Z' }
          ]
        },
        {
          name: 'Room 104',
          users: [
            { name: 'User F' },
            { name: 'User G' },
            { name: 'User H' }
          ]
        }
      ]
    };
  }
};
</script>

<style>

</style>
