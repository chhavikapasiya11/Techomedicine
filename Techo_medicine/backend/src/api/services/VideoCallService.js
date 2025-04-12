const { Server } = require("socket.io");

let ioInstance; // Store socket.io instance

// Function to initialize socket.io
exports.initSocketServer = (server) => {
    ioInstance = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    ioInstance.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-call", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
            socket.to(roomId).emit("user-joined", socket.id);
        });

        socket.on("offer", (data) => {
            socket.to(data.roomId).emit("offer", data);
        });

        socket.on("answer", (data) => {
            socket.to(data.roomId).emit("answer", data);
        });

        socket.on("candidate", (data) => {
            socket.to(data.roomId).emit("candidate", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            socket.broadcast.emit("user-left", socket.id);
        });
    });
};

// API Function to create a video call session
exports.createCallSession = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({ error: "Doctor ID and Patient ID are required" });
        }

        // Generate a unique call session ID
        const sessionId = `call-${doctorId}-${patientId}-${Date.now()}`;

        res.json({
            message: "Call session created successfully",
            sessionId
        });
    } catch (error) {
        console.error("Error starting call session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
