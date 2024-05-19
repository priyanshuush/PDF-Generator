const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [false, "UserId!"],
        unique: false,
    },
    email: {
        type: String,
        required: [false, "Email"],
        unique: false,
    },
    title: {
        type: String
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    downloadURL: {
        type: String,
        default: "",
    },
    sessionToken: {
        type: String,
        unique: false,
        sparse: true
    },
    downloadCount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    }
});

module.exports = mongoose.model("PDF", PDFSchema);
