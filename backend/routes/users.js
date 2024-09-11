import express from "express";
import {getUsers, addUser, getUserById} from "../controllers/userController.js"

const router = express.Router();

router.get("/usuarios", getUsers);
router.get("/usuario/:id", getUserById);
router.post("/addUsuario", addUser);

export default router;