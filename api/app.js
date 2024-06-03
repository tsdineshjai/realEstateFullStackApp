import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8010, () => {
	console.log(`app is up and running successfully`);

	console.log("secret key is", process.env.SECRET_KEY);
});
