const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./schema");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const saveroutes = require("./middleware");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
async function main() {
	try {
		await mongoose.connect(
			"mongodb+srv://alahli0000club:mwwHudXjD8Evas6g@cluster0.zvsfram.mongodb.net/sameh"
		);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("Database connection error:", err);
	}
}

main();

// Routes
app.get("/", saveroutes, async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Add a route to create new users
app.post("/users", async (req, res) => {
	try {
		const { name, email } = req.body;
		const newUser = new User({ name, email });
		await newUser.save();
		res.status(201).json(newUser);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

app.post("/login", saveroutes, async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Basic validation
		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		// Check if email is already registered
		const existingUser = await User.findOne({ email: email });

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const checkPassword = await bcrypt.compare(password, hashedPassword);

		if (!existingUser || !checkPassword) {
			return res.status(400).json({ message: "you should register first" });
		} else {
			const token = jwt.sign({ email }, "fffff");
			// Create and save the new user
			const newUser = new User({
				name,
				email,
				password: hashedPassword,
			});

			await newUser.save();

			// Respond without sending the password
			res.status(201).json({
				message: "User registered successfully",
				user: {
					id: newUser._id,
					name: newUser.name,
					email: newUser.email,
				},
				token: token,
			});
		}
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

app.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const checkEmail = await User.findOne({ email: email });
		if (checkEmail) {
			return res.json({
				message: "هذا المستخدم مسجل بالفعل",
			});
		} else {
			const newUser = new User({ name, email, password });
			await newUser.save();
			const token = jwt.sign({ email }, "fffff");
			res.json({
				message: "تم التسجيل بنجاح",
				token: token,
				user: newUser,
			});
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
