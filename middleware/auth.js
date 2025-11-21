import User from "../models/userModel.js";
import { decodeToken } from "../utils/token.js";
import asyncHandler from "./asyncHandler.js";

const authentication = asyncHandler(async (req, res, next) => {
	req.userID = decodeToken(req.cookies.token);

    if(!req.userID){
        throw new Error("pls login")
    }

    const {userID} = req.userID
	const user = await User.findOne({ _id: userID });

	if (!user) {
		res.status(400).send("authentication failed 😒😒");
	}

	next();
});

const authorization = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.userID);

	if (user.isAdmin) {
		next();
	} else {
		res.status(401).send("unauthorized");
	}
});

export {authentication, authorization}
