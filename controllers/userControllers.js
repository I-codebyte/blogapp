import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken, decodeToken } from "../utils/token.js";

const register = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	const existingUser = await User.findOne({ email });

	if (!username || !email || !password) {
		throw new Error("all fields are required! 😒😒");
	}

	if (existingUser) {
		throw new Error(`a user with this email already exist`);
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		const user = await User({
			username,
			email,
			password: hashPassword,
		});

		const token = generateToken(user._id);
		res.cookie("token", token, { maxAge: 30 * 24 * 3600 });

		await user.save();
		res.status(201).json({ username, email });
	} catch (error) {
		res.send(error.message);
	}
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const token = req.cookies.token

	if(token){
		throw new Error("you're logged in already")
	}

	if (!email || !password) {
		throw new Error("invalid credentials");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new Error(`user with ${email} does not exist.😒😒`);
	}

	const verifyPassword = await bcrypt.compare(password, user.password);

	if (verifyPassword) {
		const token = generateToken(user._id);
		res.cookie("token", token, { maxAge: 30 * 24 * 3600 });
		res.status(200).send("login successfully😁😁😁");
	} else {
		throw new Error("password is incorrect.😒😒😒");
	}
});

const logout = asyncHandler(async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		throw new Error("you're logged out already.😒😒");
	}
	res.clearCookie("token");
	res.status(200).send("user logged out");
});

const editUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	const { userID } = req.userID;
	const user = await User.findById(userID);

	if (username || email) {
		user.username = username || user.username;
		user.email = email || user.email;
		
	}

	if (password) {
		const comparePassword = await bcrypt.compare(
			password,
			user.password
		);
		if (comparePassword) {
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			user.password = hashPassword || user.password;
		} else {
			res.status(400).send("password incorrect 😒😒");
		}
	}

	await user.save()
	res.status(200).send("user updated");
});

export { register, login, logout, editUser };
