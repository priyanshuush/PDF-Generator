const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
  

  googleId: {
    type: String,
    
    unique: true,
  },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
      },

      password: {
        type: String,
        required: [false, "Please provide a password!"],
        unique: false,
      },

      downloadUrls: [{
        type: String,
        default: "",
      }],

})


module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);