const express = require("express");
const cors = require("cors");
const middleware = require("./middleware/middleware");
const videoRoute = require("./routes/videoRoute");
const { OAuth2Client } = require("google-auth-library");
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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const googleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  console.log(`user ${payload.name} verified`);

  const { sub, email, name, picture } = payload;
  const userId = sub;
  console.log(userId);
  console.log(email);
  console.log(name);
  console.log(picture);
};

app.post("/auth/google/callback", async(req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token illaingooo" });
  }

  await googleAuth(token);
  res.status(200).json({ message: "its ok da" });
});

app.get("/video/:id", videoRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "End point not found" });
});

const PORT = process.env.PORT || 8020;
app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
//  middleware.authUser,
