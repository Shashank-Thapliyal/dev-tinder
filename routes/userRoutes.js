import express from "express";
import { editProfile, viewProfile,getAllUsers, getConnections } from "../controllers/user/profileController.js";
import { blockProfile, unblockProfile, getBlockedUsers } from "../controllers/user/blockController.js";
import { changePassword, deleteUser } from "../controllers/user/accountController.js";
import authorize from "../middlewares/authorize.js"


const router = express.Router()

router.patch("/",authorize, editProfile);
router.get("/viewProfile/:userID",authorize, viewProfile );
router.get("/feed", authorize, getAllUsers);
router.get("/connections", authorize, getConnections);

router.patch("/block/:userID", authorize, blockProfile);
router.patch("/unblock/:userID", authorize, unblockProfile);
router.get("/blockedusers", authorize, getBlockedUsers);

router.delete("/",authorize, deleteUser);
router.patch("/changePassword", authorize, changePassword);


export default router;