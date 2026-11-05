
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/dp");
const rsvpRoutes = require("./routes/rsvp");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(helmet());


const allowedOrigins = [
    "https://wedding-five-azure-82.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://wedcard1-eosin.vercel.app",
    "https://admin-gray-three-94.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.options(/.*/, cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Wait for MongoDB before processing API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Middleware Error:", error.message);

        res.status(503).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Routes
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Walima Guest Management API is running!"
    });
});

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export Express app for Vercel
module.exports = app;
