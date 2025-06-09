import {
  findAll,
  findByID,
  findByUserName,
  updateUser,
} from "../../db/userQueries.js";
import ConnectionRequestModel from "../../models/ConnectionRequest.model.js";
import User from "../../models/User.model.js";


//view profile
export const viewProfile = async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await findByID(userID);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const loggedInUserID = req.user.userID;
    const loggedInUser = await findByID(loggedInUserID);
    
    if(loggedInUser.blockedUsers.map( id => id.toString()).includes(userID.toString())
       || user.blockedUsers.map( id => id.toString()).includes(loggedInUserID.toString())){
      return res.status(409).json({message : "User is Blocked"});
    }
   
    const ALLOWED_DATA = ["firstName", "middleName", "lastName", "userName", "dob", "gender", "profilePic", "about", "skills"];
    const data = {};

    ALLOWED_DATA.forEach( (val) =>{
      if( user[val] !== null && user[val] !== undefined )
        data[val] = user[val];
    })
    
    return res.status(200).json({ data });
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
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const loggedInUser = await findByID(req.user.userID)
    .select("connections blockedUsers")
    .populate("sentReq", "receiverID");

    const sentReq = loggedInUser.sentReq.map( req => req.receiverID?.toString());

    const users = await User.find({
        _id : {
            $nin : [...loggedInUser.connections, req.user.userID, ...loggedInUser.blockedUsers, ...sentReq]
      }}
    )
    .select("firstName middleName lastName userName dob gender profilePic about skills")
    .skip(skip)
    .limit(limit);

    if (!users) return res.status(404).json({ message: "No users found!" });

    res.status(200).json({ Users: users });
  } catch (err) {
    return res.status(500).json({ message: "Error while fetching the users" ,error : err.message});
  }
};

export const getConnections = async (req, res) =>{
  try {
    const {userID} = req.user;
    const userConnections = await findByID(userID).populate({
        path : "connections",
        select : "_id firstName middleName lastName userName profilePic about skills"
        
    })

    if(!userConnections)
        return res.status(404).json({message : "User Connections not found"});
    
    return res.status(200).json( {message : "Connection fetched successfully", data : userConnections.connections})
  } catch (err) {
    return res.status(500).json({ message : "Error while Loading Connections", "error" : err.message});
  }
}