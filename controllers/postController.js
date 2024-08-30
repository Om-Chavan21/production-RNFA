const postModel = require("../models/postModel");

// Create Post Controller
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate
    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Please enter both title and description",
      });
    }

    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    console.log(req.auth._id);
    return res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });

    // Find User
    // const user = await userModel.findOne({ email });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error from Post API (createPostController)",
      error,
    });
  }
};

// Get All Posts Controller
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error from postController (getAllPostsController)",
      error,
    });
  }
};

// Get User Posts Controller
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel
      .find({ postedBy: req.auth._id })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "User Posts",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error from postController (getUserPostsController)",
      error,
    });
  }
};

// Delete Post Controller
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Post Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error from postController (deletePostController)",
      error,
    });
  }
};

// Update Post Controller
const updatePostController = async (req, res) => {
  try {
    // Get Updated Data from Frontend
    const { title, description } = req.body;

    // Find Post to Update
    const post = await postModel.findById({ _id: req.params.id });

    // Validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Provide both title and description",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Post Updated",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error from postController (updatePostController)",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
