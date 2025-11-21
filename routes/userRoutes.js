import express from "express";
import {
	editUser,
	login,
	logout,
	register,
} from "../controllers/userControllers.js";
import { authentication } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/user/edit", authentication, editUser);

export default router;
