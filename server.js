const express = require("express");
const http = require("http");
const next = require("next");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const waitingUsers = new Set();

  io.on("connection", (socket) => {
    waitingUsers.add(socket);
      io.emit("user_count", { count: io.engine.clientsCount });

    if (waitingUsers.size >= 2) {
      const [user1, user2] = Array.from(waitingUsers).slice(0, 2);
      waitingUsers.delete(user1);
      waitingUsers.delete(user2);

      const roomId = `${user1.id}-${user2.id}`;
      user1.join(roomId);
      user2.join(roomId);

      user1.data = { roomId, partnerId: user2.id };
      user2.data = { roomId, partnerId: user1.id };

      user1.emit("paired", { roomId, partnerId: user2.id });
      user2.emit("paired", { roomId, partnerId: user1.id });
    }

    socket.on("message", ({ roomId, user, text }) => {
      socket.to(roomId).emit("message", { user, text });
    });

    socket.on("disconnect", () => {
      waitingUsers.delete(socket);
      io.emit("user_count", { count: io.engine.clientsCount });

      if (socket.data?.roomId) {
        socket.to(socket.data.roomId).emit("partner_left");
        const socketsInRoom = io.sockets.adapter.rooms.get(socket.data.roomId);
        if (socketsInRoom) {
          socketsInRoom.forEach((id) => {
            const partner = io.sockets.sockets.get(id);
            if (partner) {
              partner.leave(socket.data.roomId);
              delete partner.data;
            }
          });
        }
      }
    });
  });

  expressApp.use((req, res) => handle(req, res));

  server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
});

