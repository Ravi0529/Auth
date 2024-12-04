import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/authRoute.js"
import connectMongoDB from "./db/db.js"

const app = express()

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/v0/auth", authRouter)

app.listen(PORT, () => {
    connectMongoDB()
    console.log(`Port is listening on ${PORT}`)
})
