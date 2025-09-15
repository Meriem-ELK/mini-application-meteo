const dotenv = require("dotenv")
dotenv.config()

module.exports = {
    PORT: process.env.PORT,   // Port
    API_KEY: process.env.API_KEY   // Clé API pour OpenWeatherMap
}