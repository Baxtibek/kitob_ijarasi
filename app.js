const express = require('express');
const config = require('config');
console.log("app.js")
const mainRouter = require("./routes/index.routes")
const sequelize = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandling = require('./middleware/error/error.handling');
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
})
const PORT = config.get("port") || 3001


const logger = require("./services/logger.service");
const requestLogger = require('./middleware/loggers/request.logger');
const requestErrorLogger = require('./middleware/loggers/request.error.logger');

// logger.log("info", "LOG ma'lumotlari")
// logger.error("ERROR ma'lumotlari")
// logger.debug("DEBUG ma'lumotlari")
// logger.warn("WARM ma'lumotlari")
// logger.info("INFO ma'lumotlari")


const app = express()
app.use(cookieParser())
app.use(express.json()) /// parse body

app.use(requestLogger)
app.use("/api", mainRouter)
app.use(
    requestErrorLogger
)

app.use(errorHandling) // doim oxirida boladi
async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        app.listen(PORT, () =>{
            console.log(`Server started at: http://localhost:${PORT}`);
            
        })
    } catch (error) {
        console.log(error)
    }
}

start()