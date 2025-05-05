import express from "express";
import User from "../models/User.model.js";

const router = express.Router();

router.get("/test-explain", async (req, res) => {
  try {
    const result = await User.collection
      .find({ email: "shashank@gmail.com" })
      .explain("executionStats");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;