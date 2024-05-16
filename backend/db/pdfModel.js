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
    // session_token: {
    //     type: String,
    //     unique: false,  //change it to true when implementing session logic
    //     expires: '1h'
    // },
    downloadCount: {
        type: Number,
    }
});

module.exports = mongoose.model("PDF", PDFSchema);
