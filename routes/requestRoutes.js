import express from "express";
import authorize from "../middlewares/authorize.js";
import {sendConnectionRequest} from "../controllers/request/connectionController.js"


const Router = express.Router();


Router.post("/send/:userID", authorize, sendConnectionRequest);

export default Router;