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
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter(),
  });

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
  });

  //users go live logic
  const liveUsers = []; // Een array om de live gebruikers bij te houden

  //

  io.on("connection", async (socket) => {
    /*users logic*/
    socket.on("user live", (username) => {
      liveUsers.push(username); // Voeg de gebruiker toe aan de lijst van live gebruikers
      io.emit("update live users", liveUsers); // Stuur de bijgewerkte lijst naar alle clients
    });

    socket.on("check username", (username, callback) => {
      const usernameExists = liveUsers.includes(username);
      callback(usernameExists);
    });

    socket.on("get live users", () => {
      io.emit("update live users", liveUsers); // Envoyer la liste des utilisateurs en direct à tous les clients
    });

    /*message logic*/
    socket.on("chat message", async (msg) => {
      let result;
      io.emit("chat message", msg);
    });
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}

main();
