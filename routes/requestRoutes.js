import express from "express";
import authorize from "../middlewares/authorize.js";
import {sendConnectionRequest, respondToConnectionReq} from "../controllers/request/connectionController.js"
import {getSentRequests, getPendingRequests } from "../controllers/request/requestStatusController.js"

const router = express.Router();

router.post("/send/:userID", authorize, sendConnectionRequest);
router.patch("/respond/:connectionReq", authorize, respondToConnectionReq);

router.get("/sentRequests", authorize, getSentRequests);
router.get("/pendingRequests", authorize, getPendingRequests);

export default router;