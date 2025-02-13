const userModel = require("../models/user.model")
const userService = require("../services/user.service")
const {validationResult} = require("express-validator")
const redisClient = require("../services/redis.service")

module.exports.register = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT()
        res.cookie("token", token, {httpOnly:true, sameSite : "strict", maxAge : 24*60*60*1000})

        delete user._doc.password;//to delete password from response

        return res.status(201).json({
            success : true,
            user
        })


    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: 'Invalid credentials'
            })
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                errors: 'Invalid credentials'
            })
        }
        const token = await user.generateJWT();
        res.cookie("token", token, {httpOnly:true, sameSite : "strict", maxAge : 24*60*60*1000})

        delete user._doc.password;//to delete password from response

        return res.status(200).json({ 
            success: true,
            user
        });


    } catch (err) {
        console.log(err);
        res.status(400).json({error : err.message})
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log(err);
        res.status(400).json({error : err.message})
    }
   
}

module.exports.logout = async (req, res) => {
    try {
        // redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);//24h
        
        res.clearCookie("token")
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).json({error : err.message})
    }
}

module.exports.checkAuth = async(req, res) => {
    try {
        const email = req.user.email;
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success : true,
            user
        });
    } catch (error) {
        console.log(err);
        res.status(400).json({error : err.message})
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })
        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            success: true,
            users: allUsers
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({error : err.message})

    }
}
