const mongoose=require("mongoose");

const UserSchema= new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    role:{type:String,default:"user"},
    marks:[{
        subject: String,
        score: Number,
        status: { type: String, enum: ["pass", "fail"] },
        savedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("User",UserSchema);
