import jwt from "jsonwebtoken";

const authorize = (req,res,next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Invalid Authentication" });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decodedUser;
  
    next();
  } catch (err) {
        return res.status(500).json({message : "Internal Server Error", error : err.message})
  }
};

export default authorize;