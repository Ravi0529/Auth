import jwt from "jsonwebtoken"
import { Response } from "express"

export const generateTokenAndSetCookie = (userId: string | number, res: Response): void => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.")
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // Helps prevent XSS attacks
        sameSite: "strict", // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development" // Use secure cookies in production
    })
}
