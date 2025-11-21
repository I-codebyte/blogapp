import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateToken(userID) {
	const token = jwt.sign({ userID }, process.env.SECRET_KEY, {
		expiresIn: 30 * 24 * 3600,
	});
    return token
}

function decodeToken(token){

    const decode = jwt.decode(token)
    return decode

}

export {generateToken, decodeToken}