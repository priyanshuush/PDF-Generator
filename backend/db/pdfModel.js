const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
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
    s3Key: {
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
