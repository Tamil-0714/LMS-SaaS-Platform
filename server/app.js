const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./middleware/middleware");
const videoRoute = require("./routes/videoRoute");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const crypto = require("crypto");
const { insertUserAuthId, insertDummy, fetchCourses } = require("./DB/DB");
const path = require("path");
const fs = require("fs");

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


app.use('/images/courseThumbnails', express.static(path.join(__dirname, 'images/courseThumbnails')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/courses", async (req,res) => {
  const rows = await fetchCourses();
  res.status(200).json(rows);
});

app.get('/images/courseThumbnail/:courseId', (req, res) => {
  console.log("end point tiggerd");
  
  const { courseId } = req.params;
  const imagePath = path.join(__dirname, 'images/courseThumbnails', `${courseId}.jpg`);

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
  }

  // Serve the image
  res.sendFile(imagePath);
});

// app.get("/insertDummy", async (req, res) => {
//   try {
//     const courses = [
//       {
//         course_name: "Node.js Basics",
//         course_type: "Programming",
//         course_description: "Learn the basics of Node.js.",
//       },
//       {
//         course_name: "React Fundamentals",
//         course_type: "Frontend",
//         course_description: "Understand the fundamentals of React.",
//       },
//       {
//         course_name: "Database Design",
//         course_type: "Backend",
//         course_description: "Master database design concepts.",
//       },
//       {
//         course_name: "Figma Design",
//         course_type: "Designing",
//         course_description: "Learn to create UI/UX designs with Figma.",
//       },
//       {
//         course_name: "Python for Data Science",
//         course_type: "Data Science",
//         course_description:
//           "Explore data analysis and visualization using Python.",
//       },
//     ];
//     for (const course of courses) {
//       const courseId = generateUUID();
//       const courseThumbnail = `/images/courseThumbnail/${courseId}`;
//       const rows = await insertDummy(
//         courseId,
//         course.course_name,
//         course.course_type,
//         course.course_description,
//         courseThumbnail
//       );
//       console.log(rows);
//     }
//   } catch (error) {}
// });

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
