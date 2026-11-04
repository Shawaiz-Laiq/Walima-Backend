
const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("MongoDB Connected Successfully!");
            })
            .catch((error) => {
                connectionPromise = null;
                console.error("MongoDB Connection Error:", error.message);
                throw error;
            });
    }

    await connectionPromise;
};

module.exports = connectDB;
