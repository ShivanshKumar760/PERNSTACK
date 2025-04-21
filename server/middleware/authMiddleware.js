import jwt from "jsonwebtoken";
import pool from "../connection/Pool.js";

const verifyToken=(req,res,next)=>{
	const token=req.headers['authorization'];
	if(!token) return res.sendStatus(403);
	try{
		const data=jwt.verify(token,process.env.SECRET);
		req.userId=data.id;
		next();
	}catch{
		res.sendStatus(403);
	}
};

export default verifyToken;
