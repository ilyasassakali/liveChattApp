require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("./passport-config");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
const os = require("os");
const numCPUs = os.cpus().length;
const cluster = require("node:cluster");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes"); // Importez les routes d'authentification
app.use(express.json());
app.use(flash());

mongoose
  .connect(process.env.DBPASSWORD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/", (req, res) => {
  res.json({ success: "true" });
});

//AUTHENTICATION, SESSION AND LOGINSYSTEME

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 10000 * 60 * 60, //10000 for 10 seconds
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);

//SOCKET LOGIC

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
    },
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter(),
  });

  //users go live logic
  const liveUsers = []; // Een array om de live gebruikers bij te houden
  const liveRooms = [];

  io.on("connection", async (socket) => {
    socket.on("get live users", () => {
      io.emit("update live users", liveUsers); // Envoyer la liste des utilisateurs en direct à tous les clients
      io.emit("update live rooms", liveRooms);
    });

    /*message logic*/

    socket.on("message", (data, roomName) => {
      socket.to(roomName).emit("message:received", data);
    });

    socket.on("join", (roomName) => {
      socket.join(roomName);
    });

    /*users logic*/

    socket.on("check username", (username, callback) => {
      const usernameExists = liveUsers.some(
        (user) => user.username === username
      );
      callback(usernameExists);
    });

    socket.on("user live", (data) => {
      const { username, room } = data;

      if (username !== undefined && room !== undefined) {
        socket.username = username;
        socket.room = room;

        const roomExists = liveRooms.some(
          (existingRoom) => existingRoom.name === room
        );

        if (!roomExists) {
          liveRooms.push({ name: room });
          io.emit("update live rooms", liveRooms);
        }

        const userIndex = liveUsers.findIndex(
          (user) => user.username === username
        );

        if (userIndex !== -1) {
          liveUsers[userIndex].room = room; // Mettez à jour la salle de l'utilisateur
        } else {
          liveUsers.push({ username, room }); // Ajoutez l'utilisateur s'il n'existe pas
        }

        io.emit("update live users", liveUsers);
        io.emit("update live rooms", liveRooms);
      }
    });

    socket.on("disconnect", () => {
      const disconnectedUser = socket.username;
      const room = socket.room;
      if (disconnectedUser) {
        const index = liveUsers.findIndex(
          (user) => user.username === disconnectedUser && user.room === room
        );
        if (index !== -1) {
          liveUsers.splice(index, 1);
          io.emit("update live users", liveUsers);
        }
      }
      io.emit("update live users", liveUsers);
      io.emit("update live rooms", liveRooms);
    });
    io.emit("update live rooms", liveRooms);

    console.log(liveUsers);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
}

main();
