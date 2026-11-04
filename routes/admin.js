
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fetchAdmin = require("../middleware/fetchAdmin");
const RSVP = require("../models/RVSP");

// ADMIN LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token
        });

    } catch (error) {
        console.error("Admin Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

router.get("/stats", fetchAdmin, async (req, res) => {
    try {
        const totalRSVPs = await RSVP.countDocuments();

        const attending = await RSVP.countDocuments({
            attendance: "Yes"
        });

        const notAttending = await RSVP.countDocuments({
            attendance: "No"
        });

        const result = await RSVP.aggregate([
            { $match: { attendance: "Yes" } },
            {
                $group: {
                    _id: null,
                    totalGuests: { $sum: "$guestCount" }
                }
            }
        ]);

        const totalGuests = result[0]?.totalGuests || 0;

        res.json({
            success: true,
            stats: {
                totalVisits: 0,
                totalRSVPs,
                attending,
                notAttending,
                totalGuests
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard statistics"
        });
    }
});

router.get("/rsvps", fetchAdmin, async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const skip = (page - 1) * limit;

        const [rsvps, total] = await Promise.all([
            RSVP.find()
                .select("name phone attendance guestCount submittedAt")
                .sort({ submittedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            RSVP.countDocuments()
        ]);

        res.json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            rsvps
        });

    } catch (error) {
        console.error("RSVP List Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch RSVP list"
        });
    }
});



module.exports = router;
