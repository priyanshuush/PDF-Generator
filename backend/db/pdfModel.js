const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
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
    session_token: {
        type: String,
        unique: true,
        expires: '1h'
    },
    downloadCount: {
        type: Number,
    }
});

module.exports = mongoose.model("PDF", PDFSchema);
