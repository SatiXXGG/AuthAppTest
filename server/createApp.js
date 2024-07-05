import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { createClient } from "@libsql/client";

export default function createApp({UserController: User, AppOrigin}) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const server = createServer(app);

  app.use(
    cors({
      credentials: true,
      origin: AppOrigin,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  );

  const chatDb = createClient({
    url: "libsql://chat-satixxgg.turso.io",
    authToken: process.env.AUTH_TOKEN,
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
  app.post('/user/token', User.updateToken);

  app.use(User.checkAuth);
  app.get("/user", User.getUserData);
  app.patch("/user", User.patch);

  // protected routes

  server.listen(process.env.PORT || 3000, () => {
    console.log("listening on http://localhost:"+process.env.PORT || 3000);
  });
}