const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/techo_medicine";


const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, 
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
};

module.exports = connectToMongo;
