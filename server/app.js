const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./middleware/middleware");
const videoRoute = require("./routes/videoRoute");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const crypto = require("crypto");
const { insertUserAuthId, fetchCourses } = require("./DB/DB");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  "/images/courseThumbnails",
  express.static(path.join(__dirname, "images/courseThumbnails"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
});

function generateUUID() {
  return crypto.randomBytes(8).toString("hex"); // 8 bytes = 16 hex characters
}

const googleAuth = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    const authToken = sub;
    console.log(`user ${name} verified`);

    const rows = await insertUserAuthId(sub, email, name, picture);

    console.log("this is rows : " + rows);

    return { authToken, userInfo: { name, email, picture } };
  } catch (error) {
    console.error(error);
  }
};

app.post("/auth/google/callback", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    const { authToken, userInfo } = await googleAuth(token);
    res.status(200).json({ authToken, userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.post("/runCode", verifyToken, async (req, res) => {
  const { language, code } = req.body;
  try {
    const response = await axios.post("http://localhost:3000/execute", {
      language,
      code,
    });

    return res.status(200).json({ output: response.data.output }); // Return the output for further use
  } catch (error) {
    console.error(
      "Error during code execution:",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/verify/auth", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token verified", user: req.user });
});

app.get("/courses", async (req, res) => {
  const rows = await fetchCourses();
  res.status(200).json(rows);
});

app.get("/images/courseThumbnail/:courseId", (req, res) => {
  const { courseId } = req.params;
  const imagePath = path.join(
    __dirname,
    "images/courseThumbnails",
    `${courseId}.jpg`
  );

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: "Image not found" });
  }

  // Serve the image
  res.sendFile(imagePath);
});

app.post("/imgToCode", upload.single("file"), async (req, res) => {
  // "file" matches the key in FormData.append("file", file)

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Extract the MIME type
  const mimeType = req.file.mimetype;

  // Convert the file buffer to a Base64-encoded string
  const base64String = req.file.buffer.toString("base64");

  // Respond with the Base64 string and MIME type
  const body = {
    mimeType: mimeType,
    base64String: base64String,
  };
  try {
    const result = await axios.post(
      "http://localhost:3030/proxyImgToCode",
      body
    );
    console.log("Res from proxy : ", result.data);
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({ message: "success" });
});

app.get("/video/:id", videoRoute);

app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  try {
    // Fetch the image with axios
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // Important for binary data
    });

    // Set the appropriate content-type
    res.contentType(response.headers["content-type"]);

    // Send the binary image data
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).send("Error fetching image");
  }
});
app.use((req, res, next) => {
  res.status(404).json({ message: "End point not found" });
});

const PORT = process.env.PORT || 8020;
app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
//  middleware.authUser,
