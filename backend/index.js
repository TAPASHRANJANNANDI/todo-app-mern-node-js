import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
//import todoRoute from "../backend/routes/todo.route.js";
//import userRoute from "../backend/routes/user.route.js";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://a78aafecb95444334968f4e7da117be2-1303993800.ap-south-1.elb.amazonaws.com:5173",
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Add other headers you want to allow here.
  })
);

// Database connection code
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

/*app.get("/", (req, res) => {
  res.send("Backend API is running.");
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
