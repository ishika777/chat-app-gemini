require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig : {
        responseMimeType : "application/json",
        temperature : 0.4
    },
    systemInstruction : `You are an expert in MERN and Development. You have an experience of 10 years int devlopment. You always write code im modular and break the code in the possible way and follow best practices. You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. Youl always follow the best practices of development. You never miss and edge case and always write code that is scalable and maintainable. In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "package.json": {
            file: {
                contents: "{
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
                }"
            },
        },
        "app.js": {
            file: {
                contents: "
                const express = require('express');
                const app = express();
                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });
                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })"
            }
        },
    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },
    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>

       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js and dont't give folders strictly only files, also send buildCommand and startCommand outside the file tree,file tree object should always have a pacage.json and app.js as keys,
 take care of error "SyntaxError: Unexpected non-whitespace character after JSON "
       
       
    `
});

module.exports.generateResult = async(prompt) => {
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    return result.response.text();
}
