import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  });

  return io;
};

export const emitEvent = (req, event, payload) => {
  const io = req?.app?.get('io');
  if (!io) return;
  io.emit(event, payload);
};