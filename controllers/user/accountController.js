import { encryptPassword, comparePassword } from "../../utils/encrypting.js";
import { findByID, updateUser, deleteUserByID } from "../../db/userQueries.js";

//delete user account
export const deleteUser = async (req, res) => {
  try {
    const { userID } = req.user;

    const { password } = req.body;

    const existingUser = await findByID(userID);

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const deletedUser = await deleteUserByID(userID);

    if (!deletedUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    res.clearCookie("token");
    res
      .status(200)
      .json({ message: "User Deleted Successfully", User: deletedUser.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error while deleting user data" });
  }
};

//Change Password
export const changePassword = async (req, res) => {
  try {
    const { userID } = req.user;
    const { password, newPassword } = req.body;
  
    if (!password || !newPassword)
      return res
        .status(400)
        .json({ message: "Password & New Password both are required!" });

    if (password === newPassword) {
      return res
        .status(400)
        .json({ message: "Password and New password cannot be the same!" });
    }
    const existingUser = await findByID(userID);

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentails!" });
    }

    const newHashesPassword = await encryptPassword(newPassword);

    await updateUser(userID, { password: newHashesPassword });

    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error while changing password", error: err.message });
  }
};
