import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const authMiddleware = (req,res,next) => {
    const authHeader = req.header("Authorization");
    if(!authHeader){
        return res.status(401).json({error : "Access denied, no token provided."});
    }
    const tokenParts = authHeader.split(" ");
    if(tokenParts.length!==2 || tokenParts[0]!="Bearer"){
        return res.status(401).json({message:"The Token received was not in the correct format."});
    }
    const token = tokenParts[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_URI);
        req.user= decoded.user;
        next();
    }
    catch(error){
        return res.status(401).json({error : "Invalid or Token Expired"});
    }
}
export default authMiddleware;