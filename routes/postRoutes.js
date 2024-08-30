const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

// Router Object
const router = express.Router();

// Routes
// CREATE POST ||
router.post("/create-post", requireSignIn, createPostController);

// GET ALL POSTS
router.get("/get-all-posts", getAllPostsController);

// GET USER POSTS
router.get("/get-user-posts", requireSignIn, getUserPostsController);

// DELETE POST
router.delete("/delete-post/:id", requireSignIn, deletePostController);

// UPDATE POST
router.put("/update-post/:id", requireSignIn, updatePostController);

// Exports
module.exports = router;
