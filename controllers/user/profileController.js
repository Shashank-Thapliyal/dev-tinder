import {
  findAll,
  findByID,
  findByUserName,
  updateUser,
} from "../../db/userQueries.js";
import ConnectionRequestModel from "../../models/ConnectionRequest.model.js";


//view profile
export const viewProfile = async (req, res) => {
  try {
    const userID = req.params.userID;
    console.log(userID);

    const user = await findByID(userID);

    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while fetching User Data", error: err.message });
  }
};

//update user profile
export const editProfile = async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "userName",
      "profilePic",
      "skills",
      "about",
      "middleName",
    ];

    const isValidUpdate = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid Updates!" });
    }

    const { userID } = req.user;

    let { firstName, lastName, userName, password, profilePic, skills } =
      req.body;

    const existingUser = await findByID(userID);
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if (userName && userName !== existingUser.userName) {
      const existingUserName = await findByUserName(userName);
      if (existingUserName) {
        return res.status(409).json({ message: "UserName already Taken" });
      }
    }

    if (skills && skills.length > 10)
      return res.status(400).json({ message: "You can add maximum 10 skills" });

    let newData = {};

    for (let key in req.body) {
      if (req.body[key] === null || req.body[key] === undefined) continue;
      if (typeof req.body[key] === "string" && req.body[key].trim()) {
        newData[key] = req.body[key].trim();
        continue;
      }

      if (req.body[key] !== null) {
        newData[key] = req.body[key];
        continue;
      }
    }

    const updatedUser = await updateUser(userID, newData);

    res
      .status(200)
      .json({ message: "Profile Updated Successfully", data: updatedUser });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while updating profile", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await findAll();

    if (!users) return res.status(404).json({ message: "No users found!" });

    res.status(200).json({ Users: users });
  } catch (err) {
    return res.status(500).json({ message: "Error while fetching the users" ,error : err.message});
  }
};


//block profile
export const blockProfile = async ( req, res ) =>{
  try {
    const blockUserID = req.params.userID;
    const user = await findByID(req.user.userID);
    const userToBlock = await findByID(blockUserID);

    if(blockUserID === user._id){
      return res.status(400).json({message: "Invalid Block Request"});
    }

    if(!userToBlock){
      return res.status(404).json({message : "User Doesn't Exist"});
    }

    if(user.blockedUsers.includes(blockUserID)){
      return res.status(409).json({message: "You have already blocked the user"});
    }
    
    user.blockedUsers.push(blockUserID);
    await user.save();

    user.connections.pull(blockUserID);
    userToBlock.connections.pull(user._id);

    await ConnectionRequestModel.deleteMany({
      $or: [
        { senderID: user._id, receiverID: blockUserID },
        { senderID: blockUserID, receiverID: user._id },
      ]
    });
    


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

    if(unblockUserID === user._id){
      return res.status(400).json({message: "Invalid Block Request"});
    }

    if(!userToUnblock){
      return res.status(404).json({message : "User Doesn't Exist"});
    }

    if(!user.blockedUsers.includes(unblockUserID)){
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
