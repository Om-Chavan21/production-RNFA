const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
} = require("../controllers/userController");

// Router Object
const router = express.Router();

// Routes
// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// UPDATE || PUT
router.put("/update-user", requireSignIn, updateUserController);

// Exports
module.exports = router;
