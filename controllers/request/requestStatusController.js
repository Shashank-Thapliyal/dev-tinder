import User from "../../models/User.model.js";

export const getSentRequests = async (req, res) =>{
    try {
        const userID = req.user.userID;

        const user = await User.findById(userID).populate(
            "sentReq", "firstName lastName photoURL email"
        )

        if(!user){
            return res.status(404).json({message: "Requests not found"});
        }

        return res.status(200).json({message: "Requests fetched successfully", data: user.sentReq});
    } catch (err) {
        return res.status(500).json({message : "Error while fetching sent Match requests", error: err.message});
    }
}

export const getPendingRequests = async (req, res) =>{
    try {
        const userID = req.user.userID;

        const user = await User.findById(userID).populate(
            "receivedReq", "firstName lastName photoURL email"
        );

        if(!user){
            return res.status(404).json({message: "Requests not found"});
        }

        return res.status(200).json({message: "Requests fetched successfully", data: user.receivedReq});
    } catch (err) {
        return res.status(500).json({message : "Error while fetching pending requests", error: err.message});
    }
}