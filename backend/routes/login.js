import express from "express";
import { addLogin } from "../controllers/loginController.js"

const router = express.Router();

router.post("/login", addLogin)

export default router;

