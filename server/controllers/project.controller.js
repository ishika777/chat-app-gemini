const projectModel = require("../models/project.model")
const userModel = require("../models/user.model")   
const projectService = require("../services/project.service")
const {validationResult} = require("express-validator")

module.exports.create = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email : req.user.email});
        const project = await projectService.createProject({name, userId : loggedInUser._id});
        res.status(201).json({
            success: true,
            project
        })
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

module.exports.getAllProject = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })
        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })
        return res.status(200).json({
            success: true,
            projects: allUserProjects
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

module.exports.addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, users } = req.body
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })
        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })
        return res.status(200).json({
            success: true,
            project
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports.getProjectById = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await projectService.getProjectById({ projectId });
        return res.status(200).json({
            success: true,
            project
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

module.exports.updateFileTree = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, fileTree } = req.body;
        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })
        return res.status(200).json({
            success: true,
            project
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}