import bcrypt from "bcrypt";

import { z } from "zod";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

const userSchema = z.object({
	email: z.string().email({ message: "input a valid email" }),
	username: z
		.string()
		.min(2, { message: "min 2 characters long" })
		.max(20, { message: "maximum 20 charactesr in length" }),
	password: z.string().min(6, { message: "min six characters in length" }),
});

/* call back function to register a user in authentication route */
export const register = async (req, res) => {
	//db opeartions

	const validatedSchema = userSchema.safeParse(req.body);

	if (!validatedSchema.success) {
		res.status(400).json({
			message: "invalid schema",
		});
	}

	const { email, password, username } = validatedSchema.data;
	const hashedPassword = await bcrypt.hash(password, 11);
	try {
		const user = await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPassword,
			},
		});
		console.log(`user was created successfully`);

		res.status(201).json({
			message: `user was created successfully with the id ${user?.id}`,
		});
	} catch (error) {
		res.status(400).json({
			message: "operation has been invalid",
		});
	}
};

/* callback function invoked when api/users/login route is accessed */

/* 
Things happening here:
1. schema validation 
2. checking if user exists
3. once the user exists, check the password match
4. generating a JWT and  sending the token. 

*/
const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const login = async (req, res) => {
	console.log(`the secret kye is `, process.env.SECRET_KEY);
	const validatedLoginDetails = loginSchema.safeParse(req.body);
	if (!validatedLoginDetails.success) {
		res.status(400).json({
			message: "invalid schema ",
		});
	}

	//try to find the record in the db using the username
	const { username, password } = validatedLoginDetails.data;

	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (!user) {
			res.status(404).json({
				message: "invalid credentials",
			});
		}

		//if we found the username , we need to check if the password matches
		if (user) {
			console.log("the user is", user.username);
			const isPasswordMatching = bcrypt.compareSync(password, user.password); // returns a boolean

			if (isPasswordMatching) {
				const age = 24 * 3600000;
				const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
					expiresIn: "24hr",
				});

				//its just limited to set cookie value.its better to use res.cookie(name,value,[optionns])

				res.cookie("token", token, {
					expires: new Date(Date.now() + 86400000),
					httpOnly: true,
				});

				res.status(200).json({
					message: `login details were accurate for the ${user.username}`,
				});
			} else {
				res.status(404).json({
					message: "password isnt matching ",
				});
			}
		}
	} catch (error) {
		res.status(404).json({
			message: `${error.message}`,
		});
	}
};
export const logout = (req, res) => {
	//this deletes the cookie . we have to pass the name of the cookie which we used to create a cookie
	res.clearCookie("token").status(200).json({
		message: "Logout Successful ",
	});
};
