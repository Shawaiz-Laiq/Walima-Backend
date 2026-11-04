require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/dp");
const rsvpRoutes = require("./routes/rsvp");
const adminRoutes = require("./routes/admin");
const app = express();





// Database connection
connectDB();

// Middleware
app.use(helmet());


app.use(cors());
app.use(express.json());
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Walima Guest Management API is running!");
});

// Routes will be added here

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});