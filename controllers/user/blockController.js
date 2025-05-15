import { findByID } from "../../db/userQueries.js";
import { deleteConnectionRequest } from "../../middlewares/deleteConnectionRequest.js";

import ConnectionRequest from "../../models/ConnectionRequest.model.js";

//block profile
export const blockProfile = async ( req, res ) =>{
    try {
      const blockUserID = req.params.userID;
      const user = await findByID(req.user.userID);
      const userToBlock = await findByID(blockUserID);
  
      if(blockUserID.toString() === user._id.toString()){
        return res.status(400).json({message: "Invalid Block Request"});
      }
  
      if(!userToBlock){
        return res.status(404).json({message : "User Doesn't Exist"});
      }
  
      if(user.blockedUsers.map(id => id.toString()).includes(blockUserID.toString())){
        return res.status(409).json({message: "You have already blocked the user"});
      }
      
      user.blockedUsers.push(blockUserID);
      await user.save();
  
      user.connections.pull(blockUserID);
      userToBlock.connections.pull(user._id);

      await user.save();
      await userToBlock.save();
      //also delete connection request if any exists
      const connectionReq = await ConnectionRequest.findOne({
        $or : [
          { senderID : blockUserID, receiverID : user._id },
          { senderID : user._id , receiverID : blockUserID }
        ]
      }).select("_id");

      if(connectionReq._id){
        deleteConnectionRequest(connectionReq);
      }
  
      res.status(200).json({message: "User Blocked Successfully"});
    } catch (err) {
      return res.status(500).json({message: "Error while Blocking user", error : err.message});
    }
  }
  
  
  //unblock
  export const unblockProfile = async ( req, res ) =>{
    try {
      const unblockUserID = req.params.userID;
      const user = await findByID(req.user.userID);
      const userToUnblock = await findByID(unblockUserID);
  
      if(unblockUserID.toString() === user._id.toString()){
        return res.status(400).json({message: "Invalid Block Request"});
      }
  
      if(!userToUnblock){
        return res.status(404).json({message : "User Doesn't Exist"});
      }
  
      if(!user.blockedUsers.map( id => id.toString() ).includes(unblockUserID.toString())){
        return res.status(409).json({message: "You have not blocked the user"});
      }
      
      user.blockedUsers.pull(unblockUserID);
      await user.save();
  
      res.status(200).json({message: "User unblocked Successfully"});
    } catch (err) {
      return res.status(500).json({message: "Error while unblocking user", error : err.message});
    }
  }
  
  
  //get all blocked users
  export const getBlockedUsers = async (req, res) => {
    try {
      const user = await findByID(req.user.userID);
  
      
      await user.populate({
        path: "blockedUsers",
        select: "_id firstName lastName email username",    });
  
      res.status(200).json({
        blocked: user.blockedUsers,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to fetch blocked users",
        error: err.message,
      });
    }
  };
  