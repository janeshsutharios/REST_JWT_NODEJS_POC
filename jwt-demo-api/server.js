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

// Generate Access Token (short-lived)
function generateAccessToken(user) {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "60s" }); // 1 min for demo
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

// Login route
app.post("/login", (req, res) => {
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

// Protected GET routes
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ username: req.user.username, role: "user" });
});

app.get("/restaurants", authenticateToken, (req, res) => {
    res.json([{ id: 1, name: "Sushi Place" }, { id: 2, name: "Pasta Corner" }]);
});

app.get("/festivals", authenticateToken, (req, res) => {
    res.json([{ id: 1, name: "Diwali" }, { id: 2, name: "Christmas" }]);
});

app.get("/users", authenticateToken, (req, res) => {
    res.json([{ id: 1, username: "Janesh" }]);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
