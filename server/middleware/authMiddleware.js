import jwt from "jsonwebtoken";
import pool from "../connection/Pool.js";

const verifyToken = (req, res, next) => {
  console.log(req.rawHeaders);
  console.log(req.headers);
  console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  if (!token) return res.sendStatus(403);
  try {
    const data = jwt.verify(token, process.env.SECRET);
    console.log(data);
    req.userId = data.id;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export default verifyToken;
