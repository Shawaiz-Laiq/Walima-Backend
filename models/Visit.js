const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({

    visitorId: {
        type: String,
        required: true,
        maxlength: 100
    },

    visitedAt: {
        type: Date,
        default: Date.now
    },

    page: {
        type: String,
        default: "invitation"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Visit", visitSchema);