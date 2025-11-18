import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const register = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	const existingUser = await User.findOne({ email });

	if (!username || !email || !password) {
		throw new Error("all fields are required! 😒😒");
	}

	if (existingUser) {
		console.log(existingUser);
		res.status(400);
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

		await user.save();
		res.status(201).json({ username, email });
	} catch (error) {
		res.send(error.message);
	}
});

export { register };
