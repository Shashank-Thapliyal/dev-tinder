import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

app.use(cookieParser());

dotenv.config();
const port = process.env.PORT || 5555;

app.use(express.json());

//routes configuration
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/requests",requestRoutes);

connectDb().then(() => {
  app.listen(port, () => {
    console.log("haiyya connected to server");
  });
}).catch((err)=>{
    console.log("failed to connect to db", err)
});
