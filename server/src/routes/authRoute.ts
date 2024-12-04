import express from "express"
import { signup, login, logout } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", ...(signup as []))
router.post("/login", ...(login as []))
router.post("/logout", logout)

export default router
