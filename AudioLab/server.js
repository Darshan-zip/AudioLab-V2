import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/audiolab", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  password: String,
  genre: String,
  bio: String,
  profilePicture: String,
});

const User = mongoose.model("User", UserSchema);

const uploadPath = "uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SIGN UP
app.post("/signup", upload.single("profilePicture"), async (req, res) => {
  const { firstName, lastName, username, password, confirmPassword, genre, bio } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    const user = new User({
      firstName,
      lastName,
      username,
      password,
      genre,
      bio,
      profilePicture: req.file?.path || "",
    });

    await user.save();
    res.send("User registered successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user.");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(401).send("User not found.");
    if (user.password !== password) return res.status(401).send("Incorrect password.");

    res.status(200).send("Login successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
