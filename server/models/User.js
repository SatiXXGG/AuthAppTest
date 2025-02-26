import { createClient } from "@libsql/client";
import { ValidateData, validatePartial } from "../schemas/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ValidateAppData } from "../schemas/App.js";
import nodemailer from "nodemailer";
dotenv.config("../.env");


const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const chatDb = createClient({
  url: "libsql://chat-satixxgg.turso.io",
  authToken: process.env.AUTH_TOKEN,
});

async function generateTables() {
  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS users (username VARCHAR(20) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, id VARCHAR(100) UNIQUE NOT NULL, description VARCHAR(100), created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, original_user VARCHAR(20))"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS TOKENS (id VARCHAR(100) UNIQUE NOT NULL, token VARCHAR(255) UNIQUE NOT NULL)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS emails (email VARCHAR(100) UNIQUE NOT NULL, id VARCHAR(100) UNIQUE NOT NULL, verified BOOLEAN NOT NULL DEFAULT FALSE)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS codes (id VARCHAR(100) UNIQUE NOT NULL, code VARCHAR(10) UNIQUE NOT NULL)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS tokens (id VARCHAR(100) PRIMARY KEY NOT NULL, token VARCHAR(100) NOT NULL)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS apps (id VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL, owner VARCHAR(100) NOT NULL, title VARCHAR(20) NOT NULL, description VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP )"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS tickets (id VARCHAR(100) NOT NULL, unique_id VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL, image VARCHAR(100), user VARCHAR(100), content VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP )"
  );
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default class UserModel {
  static async register({ user, password, email, host_url }) {
    await generateTables();
    const validated = ValidateData({ username: user, password });

    if (validated.error) {
      console.error("validation error", validated.error);
      return true;
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    try {
      const code = generateCode()
      const id = crypto.randomUUID();
      const generatedUrl = `${host_url}/verify/${id}/${code}`;

      await chatDb.execute({
        sql: "INSERT INTO users (username, password, id, description, original_user) VALUES (:username, :password, :id, :description, :original_user)",
        args: {
          username: validated.data.username,
          password: hashedPassword,
          id,
          description: "Hello world!",
          original_user: "@" + validated.data.username,
        },
      });

      await chatDb.execute({
        sql: "INSERT INTO emails (email, id, verified) VALUES (:email, :id, :verified)",
        args: {
          email: email,
          id,
          verified: true
        },
      });


      await chatDb.execute({
        sql: "INSERT INTO codes (id, code) VALUES (:id, :code)",
        args: {
          id,
          code: code,
        },
      });

      //sends the verify code..

      


      return {
        message: "User created",
        success: true,
        data: {
          user,
          hashedPassword,
          id,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        message: "Invalid credentials",
        success: false,
      };
    }
  }

  static async login(data) {
    const { user, password } = data;

    try {
      const result = await chatDb.execute({
        sql: "SELECT * FROM users WHERE username = :username",
        args: {
          username: user,
        },
      });

      const { password: userPassword, id } = result.rows[0];

      const emailResult = await chatDb.execute({
        sql: "SELECT * FROM emails WHERE id = :id",
        args: {
          id: id,
        },
      });

      const { verified } = emailResult.rows[0];

      if (!verified) {
        return { message: "Email not verified", success: false };
      }

      const isEqual = await bcrypt.compare(password, userPassword);

      if (isEqual) {
        return { message: "Login successful", success: true, data: { id } };
      } else {
        return { message: "Wrong credentials", success: false };
      }
    } catch (e) {
      return { message: "Invalid credentials", success: false };
    }
  }

  static async checkAuth({ access_token: token }) {
    if (!token) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);
      return { success: true, data: { id: decoded.id, username: decoded.username } };
    } catch (e) {
      return {
        success: false,
        message: "Not authorized",
      };
    }
  }

  static async getUserData(userId) {
    try {
      const data = await chatDb.execute({
        sql: "SELECT username, description, users.id, created_at, original_user FROM users WHERE users.id = :id",
        args: {
          id: userId,
        },
      });

      if (data.rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      return { success: true, data: data.rows[0] };
    } catch (e) {
      console.log(e);
      return { success: false, message: "Invalid credentials" };
    }
  }

  static async verifyEmail({ code }) {
    try {
      const result = await chatDb.execute({
        sql: "SELECT id, code FROM codes WHERE code = :code",
        args: {
          code,
        },
      });

      const { id, code: dbCode } = result.rows[0];

      console.log(code, dbCode);

      if (code === dbCode) {
        await chatDb.execute({
          sql: "UPDATE emails SET verified = true WHERE id = :id",
          args: {
            id,
          },
        });

        //clears the code

        await chatDb.execute({
          sql: "DELETE FROM codes WHERE id = :id",
          args: {
            id,
          },
        });
      }

      return {
        success: true,
        message: "Email verified",
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Invalid code",
      };
    }
  }

  static async patch({ data, id }) {
    try {
      const validation = validatePartial(data);
      if (validation.error) {
        return {
          success: false,
          message: validation.error.message,
        };
      }

      const validatedData = validation.data;

      const oldResult = await chatDb.execute({
        sql: "SELECT username, description FROM users WHERE id = :id",
        args: {
          id,
        },
      });

      const oldData = oldResult.rows[0];

      const { username, description } = { ...oldData, ...validatedData };

      await chatDb.execute({
        sql: "UPDATE users SET username = :username, description = :description WHERE id = :id",
        args: {
          username,
          description,
          id,
        },
      });

      return {
        success: true,
        message: "Data updated",
      };
    } catch {
      return {
        success: false,
        message: "Invalid data?",
      };
    }
  }

  static async createApp({ title, description, id }) {
    const validation = ValidateAppData({ title, description });
    if (validation.error) {
      console.log(validation);
      return {
        success: false,
        message: validation.error.message,
      };
    }

    const { title: validatedTitle, description: validatedDescription } =
      validation.data;

    try {
      const rid = crypto.randomUUID();
      await chatDb.execute({
        sql: "INSERT INTO apps (id, owner, title, description) VALUES (:id, :owner, :title, :description)",
        args: {
          title: validatedTitle,
          description: validatedDescription,
          owner: id,
          id: rid,
        },
      });

      return {
        data: { id: rid },
        success: true,
        message: "App created",
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Database error",
      };
    }
  }

  static async getApps({ id }) {
    try {
      const result = await chatDb.execute({
        sql: "SELECT id, title, description, created_at FROM apps WHERE owner = :id",
        args: {
          id,
        },
      });
      return {
        success: true,
        data: result.rows,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error getting apps",
      };
    }
  }

  static async getApp({ id, user: useId }) {
    try {
      const result = await chatDb.execute({
        sql: "SELECT id, title, description, created_at FROM apps WHERE id = :id AND owner = :owner",
        args: {
          id,
          owner: useId,
        },
      });

      if (result.rows.length === 0) {
        return {
          success: false,
          message: "404",
        };
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error getting app",
      };
    }
  }

  static async getTickets({ id }) {
    try {
      const result = await chatDb.execute({
        sql: "SELECT unique_id, content, created_at FROM tickets WHERE id = :id",
        args: {
          id,
        },
      });
      return {
        success: true,
        data: result.rows,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error getting app comments",
      };
    }
  }

  static async submitTicket({ id, content }) {
    try {
      await chatDb.execute({
        sql: "INSERT INTO tickets (id, content, unique_id) VALUES (:id, :content, :unique_id)",
        args: {
          id,
          content,
          unique_id: crypto.randomUUID(),
        },
      });
      return {
        success: true,
        message: "Ticket submitted",
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error submitting ticket",
      };
    }
  }

  static async deleteApp({ id, user }) {
    try {
      await chatDb.execute({
        sql: "DELETE FROM apps WHERE id = :id AND owner = :owner",
        args: {
          id,
          owner: user,
        },
      });
      return {
        success: true,
        message: "App deleted",
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error deleting app",
      };
    }
  }

  static async deleteTicket({ id, user }) {
    try {
      await chatDb.execute({
        sql: "DELETE FROM tickets WHERE unique_id = :id",
        args: {
          id,
        },
      });
      return {
        success: true,
        message: "Post deleted",
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error deleting post",
      };
    }
  }
}
