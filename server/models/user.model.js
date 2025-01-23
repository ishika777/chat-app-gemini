const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength : 6,
        maxLength : 50
    },
    password : {
        type : String,
        select : false
    }
})

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function(){
    return jwt.sign({email : this.email}, process.env.SECRET_KEY, {expiresIn : "24h"})
}

const User = mongoose.model("User", userSchema)
module.exports = User;