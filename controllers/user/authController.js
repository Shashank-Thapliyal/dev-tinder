import User from "../../models/User.model.js";
import { validateData } from "../../utils/validateSignUpData.js"
import { encryptPassword, comparePassword } from "../../utils/encrypting.js";
import { findByEmail, findByUserName } from "../../db/userQueries.js";
import jwt from "jsonwebtoken";
import { sanitizeData } from "../../middlewares/userDataSanitizer.js";

//register user
export const signupUser = async (req, res) => {
  try {
    validateData(req);
    const {
      firstName,
      lastName,
      userName,
      email,
      about,
      password,
      dob,
      gender
    } = req.body;

    const existingUserEmail = await findByEmail(email);
    const existingUserName = await findByUserName(userName);

    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (existingUserName) {
      return res.status(409).json({ message: "UserName already taken" });
    }

    const hashedPassword = await encryptPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      dob,
      about,
      gender,
    });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({message : "Error while Signing Up", error: err.message });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use external function
    const existingUser = await findByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const payload = {
      userID: existingUser._id,
      email: existingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token);

    const data  = sanitizeData(existingUser);

    res.status(200).json({ user: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login Error", error : err.message});
  }
};


export const logoutUser = async (req, res) =>{
    try {
      const loggedinUser = req.user;
      
      if(loggedinUser){
        res.clearCookie("token");
        return res.status(200).json({message : "User logged out successfully"});
      }

      return res.status(401).json({message : "User not logged in"});
    } catch (err) {
      return res.status(500).json({message : "Error while loggin out the user", error: err.message});
    }
}