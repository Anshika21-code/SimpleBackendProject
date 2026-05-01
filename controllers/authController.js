import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


//  REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registered successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  LOGIN (ONLY ONE — FIXED)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // generate token
    const token = generateToken(user);

    res.json({
      message: "Login success",
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};