import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import AuthController from "./AuthController.js";

import User from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";

class AccessController extends AuthController {
  static ApiWorking = asyncHandler(async (req, res) => {
    try {
      res.status(200).json(this.generateResponse(200, "Api Working"));
    } catch (error) {
      res.status(400);
      throw new Error("Api not working");
    }
  });

  static validate = asyncHandler(async (req, res) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res
          .status(200)
          .json(this.generateResponse(200, "Validated", decoded, token));
      } catch (error) {
        res.status(401);
        throw new Error("Authorization Token Not Valid");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Authorization Token Not Present");
    }
  });

  static signup = asyncHandler(async (req, res) => {
    try {
      const { first_name, last_name, email, password, phonenumber } = req.body;

      if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
      }

      const userExists = await User.findOne({
        email: email.toLowerCase(),
        is_deleted: false,
      });

      if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phonenumber,
      });

      await RoleModel.create({
        userId: newUser._id,
        role: "employee",
      });

      const token = this.generateToken(newUser._id);

      const response = this.generateResponse(
        201,
        "Employee signup successful",
        newUser,
        token
      );

      return res.status(201).json(response);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });


  static login = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase(), is_deleted: false });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(403);
        throw new Error("Invalid password");
      }

      const token = this.generateToken(user._id);

      const response = this.generateResponse(
        200,
        "Login successful",
        {
          _id: user._id,
          first_name: user.first_name,
          email: user.email,
          role: user.role, // 👈 Important for frontend auth
        },
        token
      );

      return res.status(200).json(response);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

}

export default AccessController;
