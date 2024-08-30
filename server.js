const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");

// DOTENV Config
dotenv.config;

// MONGODB Connection
connectDB();

// REST App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/post", require("./routes/postRoutes"));

// PORT
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.bgGreen.white);
});
