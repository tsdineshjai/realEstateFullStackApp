import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
	res.json({
		message: "welcome to the testing world",
	});
});

export default router;
