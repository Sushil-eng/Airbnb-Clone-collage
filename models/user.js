 const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new Schema({
   

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,  
        
    },
    favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"   // your property model
    }
  ]


});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);