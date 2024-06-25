const mongoose = require("mongoose");

const PDFSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
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
    downloadURL:{
        type: String,
    },
    shouldExpire: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: null,
        index: { expires: '1h' }
    }
  
});

// Pre-save hook to set the expiresAt field based on shouldExpire
PDFSchema.pre('save', function(next) {
    if (this.shouldExpire) {
        this.expiresAt = new Date(Date.now() + 3600000); 
    } else {
        this.expiresAt = null; 
    }
    next();
});

module.exports = mongoose.model("PDF", PDFSchema);
