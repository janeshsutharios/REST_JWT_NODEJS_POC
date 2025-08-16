const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = "mysecretkey"; // change for production
const REFRESH_SECRET = "myrefreshsecret";
let refreshTokens = [];

// Add delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate Access Token (short-lived)
function generateAccessToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "15m" }); // 1 min for demo
}

// Generate Refresh Token (long-lived)
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login route with delay
app.post("/login", async (req, res) => {
  await delay(2500); // 2.5 second delay

  const { username, password } = req.body;
  if (username !== "test" || password !== "password") {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const user = { username };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
});


// Refresh token route
app.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});

// Logout (invalidate refresh token)
app.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.sendStatus(204);
});

// Protected GET routes with async delays
app.get("/profile", authenticateToken, async (req, res) => {
  await delay(2000); // 2 second delay
  res.json({ username: req.user.username, role: "user" });
});

app.get("/restaurants", authenticateToken, async (req, res) => {
  await delay(2000); // 2 second delay
  res.json([{ id: 1, name: "Sushi Place" }, { id: 2, name: "Pasta Corner" }]);
});

app.get("/festivals", authenticateToken, async (req, res) => {
  await delay(2000); // 2 second delay
  res.json([{ id: 1, name: "Diwali" }, { id: 2, name: "Christmas" }]);
});

app.get("/users", authenticateToken, async (req, res) => {
  await delay(2000); // 2 second delay
  res.json([{ id: 1, username: "Janesh" }]);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
