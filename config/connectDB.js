import mongoose from "mongoose";

export default async function connectDB() {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/blogapp");
		console.log("db connected... 😁😁");
	} catch (error) {
		console.error("db connection fail... 😒😒");
	}
}
