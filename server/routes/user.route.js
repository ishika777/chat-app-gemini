const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlerwares/auth.middleware")
const {body} = require("express-validator")

router.post("/register",
    body("email").isEmail().withMessage("Email address must be valid"),
    body("password").isLength({min : 3}).withMessage("Password must be atleast 3 characters long"),
    userController.register)

router.post("/login",
    body("email").isEmail().withMessage("Email address must be valid"),
    body("password").isLength({ min: 3 }).withMessage("Password must be atleast 3 characters long"),
    userController.login);

router.get("/profile", authMiddleware.authUser, userController.getProfile);

router.post("/logout", authMiddleware.authUser, userController.logout);

router.get("/all", authMiddleware.authUser, userController.getAllUsers);

router.get("/check-auth", authMiddleware.authUser, userController.checkAuth)



module.exports = router;