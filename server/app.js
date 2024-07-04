import express from "express";
import User from "./controllers/User.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createClient } from "@libsql/client";
// setup

const app = express();
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

app.use(
  cors({
    credentials: true,
    origin: "https://satixx-auth.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],	
  })
);

const chatDb = createClient({
  url: "libsql://chat-satixxgg.turso.io",
  authToken:
    process.env.AUTH_TOKEN,
});

chatDb.execute({
  sql: "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, owner VARCHAR(20), created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  args: {},
});

// public routes

app.post("/login", User.login);
app.post("/register", User.register);
app.post("/logout", User.logout);
app.post("/verify-email", User.verifyEmail);
app.post("/verify-url/:id/:code", User.verifyByURL);
app.use(User.checkAuth);
app.get("/user", User.getUserData);
app.patch("/user", User.patch);
app.post("user/message");

io.on("connection", async (socket) => {
  console.log("user connected");

  socket.on("message", async (message) => {
    

    try {
      
      const result = await chatDb.execute({
        sql: "INSERT INTO messages (message, owner) VALUES (:message, :owner)",
        args: {
          message: message,
          owner: socket.handshake.auth.username ?? "Anonymous",
        },
      })

      socket.broadcast.emit("message", {
      message: message,
      owner: socket.handshake.auth.username ?? "Anonymous",
      serverOffset: result.lastInsertRowid.toString()
    });

    } catch (e) {
      console.log(e)
    }
  });

  if (!socket.recovered) {
    console.log("basic");
    try {
      const result = await chatDb.execute({
        sql: "SELECT * FROM messages WHERE id > :offset",
        args: {
          offset: socket.handshake.auth.serverOffset ?? 0,
        },
      });

      const messages = result.rows.map((row) => {
        const { id, message, owner, created_at } = row;
        socket.broadcast.emit("message", {
          message: message,
          owner: owner,
          created_at: created_at,
        })
      })
    } catch (e) {
      console.log(e);
    }
  }
});

// protected routes

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
