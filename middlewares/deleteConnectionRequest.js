import { findByID } from "../db/userQueries.js";
import ConnectionRequest from "../models/ConnectionRequest.model.js";

export const deleteConnectionRequest = async (requestID, res) => {
    try {
        console.log(requestID)
  const connectionReq = await ConnectionRequest.findById(requestID);
  if (!connectionReq) return;

  const { senderID, receiverID } = connectionReq;

  const sender = await findByID(senderID);
  const receiver = await findByID(receiverID);

  sender.sentReq.pull(requestID);
  receiver.receivedReq.pull(requestID);

  await sender.save();
  await receiver.save();
  await ConnectionRequest.findByIdAndDelete(requestID);   
    } catch (err) {
      return console.log({message : "Error while Deleting Connection Request", error : err.message})
    }
};
