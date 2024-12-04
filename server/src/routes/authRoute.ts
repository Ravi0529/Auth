import express from "express"
import { signup, login, logout, getMe } from "../controllers/authController.js"
import { protectedRoute } from "../middlewares/protectedRoute.js"

const router = express.Router()

router.post("/signup", ...(signup as []))
router.post("/login", ...(login as []))
router.post("/logout", logout)
router.get("/getMe", protectedRoute as any, getMe as any)

export default router
