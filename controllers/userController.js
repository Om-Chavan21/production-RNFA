const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const { expressjwt: jwt } = require("express-jwt");

// Middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required (min. 6 characters)",
      });
    }

    // User Exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: true,
        message: "User already Registered with this EMail",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Save User
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registration Successful, Please Login",
    });
  } catch (error) {
    console.log(`${error}`);
    return res.status(500).send({
      success: false,
      message: "Error in Registration API (userController)",
      error,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please enter both Email and Password",
      });
    }

    // Find User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    // Match Password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    // TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Undefine Password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Logged in Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(`${error}`);
    return res.status(500).send({
      success: false,
      message: "Error in Login API (userController)",
      error,
    });
  }
};

// Update User Data
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Password Validation
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required (Min. 6 char)",
      });
    }

    // Find User
    const user = await userModel.findOne({ email });

    // Hashed Password
    const hashedPassword = password ? await hashPassword(password) : undefined;

    // Updated User
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      successful: true,
      message: "Profile Updated Successfully. Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      successful: false,
      message: "Error in User Update API (updateUserController)",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
