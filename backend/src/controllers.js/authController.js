import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, name } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all feilds are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exist, please use a different email" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

    const newUser = new User({
      email,
      name,
      password,
      profile: randomAvatar,
    });

    await newUser.save();

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.name,
        image: newUser.profile || "",
      });
      console.log("stream user created for ", newUser.name);
    } catch (err) {
      console.log("Error creating Stream user ", err);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (err) {
    console.log("error in signup controller", err);
    res.status(500).json({ message: "sigup Internal Server Error " });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All feilds are needed" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //token creating
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.log("error in login", err);
    res.status(500).json({ message: "login error" });
  }
}

export function logout(req, res) {
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { name, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!name || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All feilds are required",
        missingFeilds: [
          !name && "name",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        image: updatedUser.profile || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.name}`,
      );
    } catch (err) {
      console.log("error updating stream user during onboarding");
    }

    res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (err) {
    console.log("error in onboarding controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function me(req, res) {
  try {
    // Generate a new token for the logged-in user
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send user info + token back to frontend
    res.status(200).json({ success: true, user: req.user, token });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
