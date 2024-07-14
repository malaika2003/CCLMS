import { Router } from "express";
import authorize from "../middleware/authorization.js";
import pool from "../db.js";

const router = Router();

router.post("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name,user_email,divison,lobby,authority,designation FROM users WHERE user_id = $1",
      [req.user.id]
    );

    // if would be req.user if you change your payload to this:
    // function jwtGenerator(user_id) {
    //   const payload = {
    //     user: user_id
    //   };
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;