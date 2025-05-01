
import express from "express";
import { editProfile, viewProfile,getAllUsers } from "../controllers/user/profileController.js";
import { changePassword, deleteUser } from "../controllers/user/accountController.js";
import authorize from "../middlewares/authorize.js"


const router = express.Router() 

router.patch("/",authorize, editProfile);
router.get("/viewProfile/:userID",authorize, viewProfile );
router.get("/list", authorize, getAllUsers);


router.delete("/",authorize, deleteUser);
router.patch("/changePassword", authorize, changePassword);
export default router;