import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  console.log("server is running...");

  io = new Server(httpServer);
  let onlineUsers = [];

  io.on("connection", (socket) => {
    // add user
    socket.on("addNewUser", (clerkUser) => {
      // check if the user is in the list of online users
      clerkUser &&
        !onlineUsers.some((user) => user.userId === clerkUser.id) &&
        onlineUsers.push({
          userId: clerkUser.id,
          socketId: socket.id,
          profile: clerkUser,
        });

      // emit online users to all connected clients
      io.emit("getUsers", onlineUsers);
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // emit online users to all connected clients
      io.emit("getUsers", onlineUsers);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    // ...
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
