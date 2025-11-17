import express from "express";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 4500;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () =>
	console.log(`server is running on port: ${port}... 😁😁`)
);
