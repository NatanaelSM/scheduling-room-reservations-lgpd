import express from "express";
import {getUsers, addUser, getUserById, deleteUser} from "../controllers/userController.js"

const router = express.Router();

router.get("/usuarios", getUsers);
router.get("/getUsuario", getUserById);
router.post("/addUsuario", addUser);
router.delete("/deleteUsuario/:id", deleteUser)

export default router;