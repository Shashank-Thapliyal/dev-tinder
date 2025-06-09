import { findByID } from "../../db/userQueries.js";
import { deleteConnectionRequest } from "../../middlewares/deleteConnectionRequest.js";
import { sanitizeData } from "../../middlewares/userDataSanitizer.js";
import ConnectionRequest from "../../models/ConnectionRequest.model.js";

//sending a new connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const senderID = req.user.userID;
    const receiverID = req.params.userID;


    if(senderID.toString() === receiverID.toString()){
        return res.status(404).json({ message: "Sender & Receiver can't be the Same" });
    }

    const receiver = await findByID(receiverID);
    const sender =   await findByID(req.user.userID); 

    if (!receiver) {
      return res.status(404).json({ message: "Receiver doesn't Exist" });
    }
    // Prevent sending request if already connected
    if (sender.connections.map(id => id.toString()).includes(receiverID.toString()) || receiver.connections.map(id => id.toString()).includes(senderID.toString())) {
      return res.status(400).json({ message: "You are already connected with this user" });
    }

    if (receiver.blockedUsers.map(id => id.toString()).includes(senderID.toString()) || sender.blockedUsers.map(id => id.toString()).includes(receiverID.toString())) {
      return res.status(403).json({ message: "User is Blocked, Can't send request" });
    }
    
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    });

    if (existingConnectionRequest && existingConnectionRequest.status === "accepted") {
      return res
        .status(400)
        .json({ message: "Connection Already Exists" });
    }
    
    if (existingConnectionRequest && existingConnectionRequest.status === "pending") {
      return res
        .status(400)
        .json({ message: "Connection req already Exists" });
    }

    if(!existingConnectionRequest){
      const newConnectionReq =  new ConnectionRequest({senderID, receiverID});
      await newConnectionReq.save();

      sender.sentReq.push(newConnectionReq._id);
      receiver.receivedReq.push(newConnectionReq._id); 

      await sender.save();
      await receiver.save();
      res.status(201).json({ message: `Connection request sent successfully to ${receiverID}` });
    }else if(existingConnectionRequest && existingConnectionRequest.status === "ignored"){
      existingConnectionRequest.status = "pending";
      await existingConnectionRequest.save();
      sender.sentReq.push(existingConnectionRequest._id);
      receiver.receivedReq.push(existingConnectionRequest._id); 
        
      await sender.save();
      await receiver.save();
      res.status(200).json({ message: `Connection request resent successfully to ${receiverID}` });
    }
    
  } catch (err) {
    return res.status(500).json({
      message: "Error while sending connection request",
      error: err.message,
    });
  }
};

//responding to a recieved connection request
export const respondToConnectionReq = async (req, res) =>{
  try {
    const  requestID = req.params.requestID;
    const { status } = req.body;
    const connectionReq = await ConnectionRequest.findById(requestID);
    if(!connectionReq){
      return res.status(404).json({message: "Connection Request Not found"});
    }

    const senderID = connectionReq.senderID;
    const receiverID = connectionReq.receiverID;

    const ALLOWED_STATUS = ["accepted", "ignored", "pending"];
    const isStatusValid = ALLOWED_STATUS.includes(status);
    
    if(!isStatusValid){
      return res.status(400).json({message: "Invalid Status type"});
    }

    const sender = await findByID(senderID);
    const receiver = await findByID(receiverID);

    if( status === "accepted"){
      sender.connections.push(receiverID);
      receiver.connections.push(senderID);

      await sender.save();
      await receiver.save();
    }

    await deleteConnectionRequest(requestID, res);

    const senderData = sanitizeData(sender);
    const receiverData = sanitizeData(receiver);
      return res.status(200).json({
      message: `Connection Request ${status}`,
      user1 :  senderData,
      user2 : receiverData
    });
    
  } catch (err) {
    return res.status(500).json({message: "error while responding to request", error : err.message});
  }  
}

