require("dotenv").config();
const http = require("http"); 
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");
const authRoutes = require("./src/api/routes/auth");
const geminiRoutes = require("./src/api/routes/gemini");
const matchRoute=require("./src/api/routes/matchDoctor")
const meetingRoute = require("./src/api/routes/meeting");
const getmeetRoute=require("./src/api/routes/getmeetlink")
const { initSocketServer } = require("./src/api/services/VideoCallService");

const app = express();
const server = http.createServer(app); 


// Connect to MongoDB
connectToMongo();
console.log("MongoDB connected");

// Initialize Socket.io server
initSocketServer(server); 

const port = process.env.PORT || 7000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/gemini", geminiRoutes);
app.use("/api/matchDoctor", matchRoute); 
app.use("/api/meeting", meetingRoute); 
app.use("/api/getmeet", getmeetRoute); 

if (authRoutes && typeof authRoutes === "function") {
    app.use("/api/auth", authRoutes);
} else {
    console.error("Error: authRoutes is not a valid middleware function.");
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server using `server.listen`
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port} `);
});
