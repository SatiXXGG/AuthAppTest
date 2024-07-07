import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { createClient } from "@libsql/client";

export default function createApp({ UserController: User, AppOrigin }) {
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

  // public routes

  app.post("/login", User.login);
  app.post("/register", User.register);
  app.post("/logout", User.logout);
  app.post("/verify-email", User.verifyEmail);
  app.post("/verify-url/:id/:code", User.verifyByURL);
  app.post('/app/:id/tickets', User.submitTicket)
  app.post("/user/token", User.updateToken);
  app.use(User.checkAuth);

  app.get("/user", User.getUserData);
  app.patch("/user", User.patch);
  app.post("/user/app", User.createApp);
  app.delete('/app', User.deleteApp)
  app.get("/user/app", User.getApps);
  app.get('/app/:id', User.getApp)
  app.get('/app/:id/tickets', User.getTickets)


  // protected routes

  server.listen(process.env.PORT || 3000, () => {
    console.log("listening on http://localhost:" + process.env.PORT || 3000);
  });
}
