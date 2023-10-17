const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();

const os = require("os");
const numCPUs = os.cpus().length;
const cluster = require("node:cluster");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isPrimary) {
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i,
    });
  }
  // set up the adapter on the primary thread
  return setupPrimary();
}

async function main() {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    //connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter(),
  });

  //users go live logic
  const liveUsers = []; // Een array om de live gebruikers bij te houden

  io.on("connection", async (socket) => {
    /*users logic*/
    socket.on("user live", (username) => {
      socket.username = username; // Attribuer le nom d'utilisateur à la socket

      liveUsers.push(username); // Voeg de gebruiker toe aan de lijst van live gebruikers
      io.emit("update live users", liveUsers); // Stuur de bijgewerkte lijst naar alle clients
    });

    socket.on("disconnect", () => {
      const disconnectedUser = socket.username;
      console.log("ca c ton disconecteduser: " + disconnectedUser);
      if (disconnectedUser) {
        console.log("une deco a ete faite par " + disconnectedUser);
        const index = liveUsers.indexOf(disconnectedUser);
        if (index !== -1) {
          liveUsers.splice(index, 1);
          io.emit("update live users", liveUsers);
        }
      }
    });

    console.log(liveUsers);

    socket.on("check username", (username, callback) => {
      const usernameExists = liveUsers.includes(username);
      callback(usernameExists);
    });

    socket.on("get live users", () => {
      io.emit("update live users", liveUsers); // Envoyer la liste des utilisateurs en direct à tous les clients
    });

    /*message logic*/

    socket.on("message", (data, roomName) => {
      socket.to(roomName).emit("message:received", data);
    });

    socket.on("join", (roomName) => {
      socket.join(roomName);
    });
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}

main();
