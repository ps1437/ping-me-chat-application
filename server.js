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

  const waitingUsers = [];

  io.on("connection", (socket) => {
    waitingUsers.push(socket);

    if (waitingUsers.length >= 2) {
      const user1 = waitingUsers.shift();
      const user2 = waitingUsers.shift();
      const roomId = `${user1.id}-${user2.id}`;
      user1.join(roomId);
      user2.join(roomId);

      user1.roomId = roomId;
      user2.roomId = roomId;

      user1.emit("paired", { roomId, partnerId: user2.id });
      user2.emit("paired", { roomId, partnerId: user1.id });
    }

    socket.on("message", ({ roomId, user, text }) => {
      socket.to(roomId).emit("message", { user, text });
    });

    socket.on("disconnect", () => {
      const idx = waitingUsers.findIndex((s) => s.id === socket.id);
      if (idx !== -1) waitingUsers.splice(idx, 1);
      if (socket.roomId) socket.to(socket.roomId).emit("partner_left");
    });
  });

  // ✅ This works better with App Router and avoids `path-to-regexp` issues
  expressApp.use((req, res) => handle(req, res));

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
