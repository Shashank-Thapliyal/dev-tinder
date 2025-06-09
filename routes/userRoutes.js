import express from "express";
import { editProfile, viewProfile,getAllUsers, getConnections } from "../controllers/user/profileController.js";
import { blockProfile, unblockProfile, getBlockedUsers } from "../controllers/user/blockController.js";
import { changePassword, deleteUser } from "../controllers/user/accountController.js";
import authorize from "../middlewares/authorize.js"
import upload from "../middlewares/upload.js";
import uploadProfilePic from "../controllers/user/uploadController.js";


const router = express.Router()

router.get("/viewProfile/:userID",authorize, viewProfile );
router.get("/feed", authorize, getAllUsers);
router.get("/connections", authorize, getConnections);

router.patch("/",authorize, editProfile);
router.post("/uploadprofilepic", authorize, upload.single("profilePic"), uploadProfilePic);

router.patch("/block/:userID", authorize, blockProfile);
router.patch("/unblock/:userID", authorize, unblockProfile);
router.get("/blockedusers", authorize, getBlockedUsers);

router.delete("/",authorize, deleteUser);
router.patch("/changePassword", authorize, changePassword);


export default router;