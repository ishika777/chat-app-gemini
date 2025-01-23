const aiService = require("../services/ai.service")


module.exports.getResult = async (req, res) => {
    try {
        const {prompt} = req.query;
        const result = await aiService.generateResult(prompt)
        res.status(200).json({
            result
        })
    } catch (error) {
        res.status(400).json({ error: err.message })
    }
}   