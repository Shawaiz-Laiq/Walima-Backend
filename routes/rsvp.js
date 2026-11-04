
const express = require("express");
const router = express.Router();

const RSVP = require("../models/RVSP");

// POST: Save guest RSVP
router.post("/", async (req, res) => {
    try {
        const { name, phone, attendance, guestCount } = req.body;

        // Validation
        if (!name || !phone || !attendance) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, phone and attendance."
            });
        }

        if (!["Yes", "No"].includes(attendance)) {
            return res.status(400).json({
                success: false,
                message: "Attendance must be Yes or No."
            });
        }

        const count = guestCount === undefined ? 1 : Number(guestCount);

        if (!Number.isInteger(count) || count < 1 || count > 20) {
            return res.status(400).json({
                success: false,
                message: "Guest count must be between 1 and 20."
            });
        }

        const newRSVP = await RSVP.create({
            name,
            phone,
            attendance,
            guestCount: count
        });
        const message = `New Walima RSVP!

Name: ${name}
Phone: ${phone}
Attendance: ${attendance}
Guests: ${count}`;

const whatsappLink = `https://wa.me/${process.env.WHATSAPP_ADMIN_NUMBER}?text=${encodeURIComponent(message)}`;

       res.status(201).json({
    success: true,
    message: "RSVP submitted successfully!",
    whatsappLink,
    data: newRSVP
});

    } catch (error) {
        console.error("RSVP Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while submitting RSVP."
        });
    }
});

module.exports = router;
