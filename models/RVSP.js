const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    attendance: {
        type: String,
        enum: ["Yes", "No"],
        required: true
    },
    guestCount: {
        type: Number,
        default: 1,
        min: 1,
        max: 20
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("RSVP", rsvpSchema);