import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../connection/Pool.js";
dotenv.config();

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = await pool.query(
    `INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *`,
    [username, email, hashPassword]
  );

  res.json(user.rows[0]);
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (!user.rows.length)
    return res.status(401).json({ error: "Invalid Credentials" });

  const valid = bcrypt.compareSync(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ error: "Invalid Credentials" });

  const token = jwt.sign({ id: user.rows[0].id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
};
