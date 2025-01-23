const userModel = require("../models/user.model")

module.exports.createUser = async({email, password}) => {
    if(!email || !password){
        throw new Error("Email and Password are required")
    }
    const hashedPassword = await userModel.hashPassword(password)
    const user = await userModel.create({
        email,
        password :hashedPassword
    })
    return user;
}

module.exports.getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}