import { findByID } from "../../db/userQueries.js";
import ConnectionRequest from "../../models/ConnectionRequest.model.js";


export const sendConnectionRequest = async (req, res) => {
  try {
    const senderID = req.user.userID;
    const receiverID = req.params.userID;


    if(senderID === receiverID){
        return res.status(404).json({ message: "Sender & Reciever can't be the Same" });
    }

    const receiver = await findByID(receiverID);
    const sender =   await findByID(req.user.userID); 

    if (!receiver) {
      return res.status(404).json({ message: "Reciever doesn't Exist" });
    }

    console.log(req.user)
    if (receiver.blockedUsers.includes(senderID) || sender.blockedUsers.includes(receiverID)) {
      return res.status(403).json({ message: "User is Blocked, Can't send request" });
    }
    
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection Request Already Exists" });
    }

    const newConnectionReq =  new ConnectionRequest({senderID, receiverID});
    await newConnectionReq.save();

    
    sender.sentReq.push(receiverID);
    receiver.receivedReq.push(senderID); 

    await sender.save();
    await receiver.save();
    res.status(201).json({message : `Connection Req sent successfully to ${receiverID}`});
 
  } catch (err) {
    return res.status(500).json({
      message: "Error while sending connection request",
      error: err.message,
    });
  }
};
