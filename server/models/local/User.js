import { createClient } from "@libsql/client";
import { ValidateData, validatePartial } from "../../schemas/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { Resend } from "resend";

configDotenv();

const resend = new Resend(process.env.RESEND_KEY);

const chatDb = createClient({
  url: "libsql://chat-satixxgg.turso.io",
  authToken:
    process.env.AUTH_TOKEN
});

async function generateTables () {
  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS users (username VARCHAR(20) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, id VARCHAR(100) UNIQUE NOT NULL, description VARCHAR(100), created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, original_user VARCHAR(20))"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS emails (email VARCHAR(100) UNIQUE NOT NULL, id VARCHAR(100) UNIQUE NOT NULL, verified BOOLEAN NOT NULL DEFAULT FALSE)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS codes (id VARCHAR(100) UNIQUE NOT NULL, code VARCHAR(10) UNIQUE NOT NULL)"
  );

  await chatDb.execute(
    "CREATE TABLE IF NOT EXISTS images (id VARCHAR(100) PRIMARY KEY NOT NULL, image BLOB)")
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default class UserModel {
  static async register({ user, password, email, host_url }) {
    await generateTables()
    const validated = ValidateData({ username: user, password });

    if (validated.error) {
      console.error("validation error", validated.error);
      return true;
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    try {
      const id = crypto.randomUUID();

      await chatDb.execute({
        sql: "INSERT INTO users (username, password, id, description, original_user) VALUES (:username, :password, :id, :description, :original_user)",
        args: {
          username: user,
          password: hashedPassword,
          id,
          description: "Hello world!",
          original_user: user
        },
      });

      await chatDb.execute({
        sql: "INSERT INTO emails (email, id) VALUES (:email, :id)",
        args: {
          email: email,
          id,
        },
      });

      await chatDb.execute({
        sql: "INSERT INTO images (id, image) VALUES (:id, :image)",
        args: {
          id,
          image: null,
        },
      });

      const code = generateCode();

      await chatDb.execute({
        sql: "INSERT INTO codes (id, code) VALUES (:id, :code)",
        args: {
          id,
          code: code,
        },
      });

      //sends the verify code..
      console.log(host_url)
      const generatedUrl = `${host_url}/verify/${id}/${code}`


      resend.emails.send({
        from: "onboarding@resend.dev",
        to: email, 
        subject: "Verify your email",
        text: `Your verification code is ${code} \n
        or enter this link ${generatedUrl} \n`,
      })

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

  static async checkAuth(cookies) {
    const { access_token: token } = cookies;
    if (!token) {
      return {
        success: false,
        message: "Not authorized",
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
        sql: "SELECT username, description, users.id, image, created_at, original_user FROM users LEFT JOIN images ON users.id = images.id WHERE users.id = :id",
        args: {
          id: userId,
        },
      });

   

      return { success: true, data: data.rows[0] };
    } catch (e) {
      console.log(e)
      return { success: false, message: "Invalid credentials" };
    }
  }

  static async verifyEmail({code}) {
    console.log(code)

    try {
      const result = await chatDb.execute({
        sql: "SELECT id, code FROM codes WHERE code = :code",
        args: {
          code,
        },
      });

      const { id, code: dbCode } = result.rows[0];

      console.log(code, dbCode)

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
      }


    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: "Invalid code",
      }
    }
  }

  static async patch({data, id}) {
    try {
      const validation = validatePartial(data)
      if (validation.error) {
        return {
          success: false,
          message: validation.error.message
        }
      }

      const validatedData = validation.data
      
      const oldResult = await chatDb.execute({
        sql: "SELECT username, description FROM users WHERE id = :id",
        args: {
          id
        }
      })

      const oldData = oldResult.rows[0]

      const {username, description} = { ...oldData, ...validatedData}
      
      await chatDb.execute({
        sql: "UPDATE users SET username = :username, description = :description WHERE id = :id",
        args: {
          username,
          description,
          id
        }
      })

      return {
        success: true,
        message: "Data updated"
      }

    } catch {
      return {
        success: false, message: "Invalid data?"}
    }
  }
}
