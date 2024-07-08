import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import { ACCEPTED_ORIGINS } from './settings/origins.js';
import rateLimiter from "express-rate-limit"

export default function createApp({ UserController: User, AppOrigin }) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(cookieParser());


  const server = createServer(app);


  const cors_full = {
      credentials: true,
      origin: (origin, callback) => {
        if (ACCEPTED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }

  const limiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 250, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })


  // public routes

  app.post('/app/:id/tickets', limiter, User.submitTicket)

  app.use(
    cors(cors_full)
  );

  app.post("/login", User.login);
  app.post("/register", User.register);
  app.post("/logout", User.logout);
  app.post("/verify-email", User.verifyEmail);
  app.post("/verify-url/:id/:code", User.verifyByURL);
  app.post("/user/token", User.updateToken);
  app.use(User.checkAuth);

  app.get("/user", User.getUserData);
  app.patch("/user", User.patch);
  app.post("/user/app", User.createApp);
  app.delete('/app', User.deleteApp)
  app.delete('/app/tickets', User.deleteTicket)
  app.get("/user/app", User.getApps);
  app.get('/app/:id', User.getApp)
  app.get('/app/:id/tickets', User.getTickets)


  // protected routes

  server.listen(process.env.PORT || 3000, () => {
    console.log("listening on http://localhost:" + process.env.PORT || 3000);
  });

}
