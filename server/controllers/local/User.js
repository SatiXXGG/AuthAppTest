import UserModel from "../../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config("../../.env");

export default class User {
  static async register(req, res) {
    const result = await UserModel.register(req.body);
    if (!result.success) {
      return res.status(500).json({ error: "BD ERROR", message: result.message });
    }

    return res.status(200).json({ message: "User created", success: true });
  }

  static async login(req, res) {
    const result = await UserModel.login(req.body);

    if (!result.success) {
      return res.status(500).json({ error: "BD ERROR", message: result.message });
    }

    const token = await jwt.sign(
      {
        id: result.data.id,
        username: result.data.username,
      },
      process.env.JWT_SECRET_WORD,
      {
        expiresIn: "30s",
      }
    );
    
    const refresh_token = await jwt.sign({
      id: result.data.id,
      username: result.data.username
    }, process.env.JWT_SECRET_WORD, {
      expiresIn: "7d",
    })

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 7 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return res.status(200).json({token, refresh_token, success: true});
  }

  static async getUserData(req, res) {
    const id = req.session.user;

    const data = await UserModel.getUserData(id);

    if (!data.success) {
      return res.status(401).json({ error: "Not allowed", message: data.message });
    }

    return res.status(200).json({
      data: data.data,
      success: true,
    });
  }

  static async checkAuth(req, res, next) {
    const result = await UserModel.checkAuth(req.cookies);
    if (result.success) {
      req.session = { user: result.data.id };
      next();
    } else {
      console.log("User is not allowed : " + req.cookies);
      res.send({ error: "Not allowed", success: false, data: {} });
    }
  }

  static async logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({ success: true });
  }

  static async verifyEmail(req, res) {
    const result = await UserModel.verifyEmail(req.body);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res
        .status(500)
        .json({ error: "Error verifying the email", message: result.message });
    }
  }

  static async verifyByURL(req, res) {
    const { id, code } = req.params;

    if (id === undefined || code === undefined) {
      return res.status(500).json({ error: "Invalid URL" });
    }

    const result = await UserModel.verifyEmail({ code });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res
        .status(500)
        .json({ error: "Error verifying the email", message: result.message });
    }
  }

  static async patch(req, res) {
    const result = await UserModel.patch({ data: req.body, id: req.session.user });

    if (!result.success) {
      return res
        .status(500)
        .json({ error: "Error saving user data", message: result.message });
    }

    return res.status(200).json(result);
  }

  // TODO: Add update token to production env

  static async updateToken(req, res) {
    try {
      const { refresh_token } = req.cookies;

      if (!refresh_token) {
        return res.status(401).json({success: false, message: "No refresh token"})
      }

      const result = jwt.verify(refresh_token, process.env.JWT_SECRET_WORD);
      const userData = await UserModel.getUserData(result.id);

      if (userData.success) {
        const newToken = jwt.sign({ //new access-token
          id: userData.data.id,
          username: userData.data.username}, process.env.JWT_SECRET_WORD, {
            expiresIn: "30s",
        })

                
        res.cookie("access_token", newToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })

        res.status(200).json({token: newToken, success: true})
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({success: false, message: "Error updating token"})
    }
  }
}
