const express = require("express")
const appRouter = require("./src/modules/index.router.js")

const dotenv = require("dotenv")
dotenv.config({ path: ".env" })

const port = process.env.PORT || 5000

const app = express()
appRouter(app)
app.listen(port, () => {
  console.log("Server Is Running.....")
})
