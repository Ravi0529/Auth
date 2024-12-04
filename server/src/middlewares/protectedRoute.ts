import { Request, Response, NextFunction } from "express"
import User, { UserDocument } from "../models/userModel.js"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
    user?: UserDocument
}

export const protectedRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        // Extract token from cookies
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" })
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select("-password") as UserDocument | null
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        req.user = user

        next()
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
