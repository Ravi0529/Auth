import { Request, Response, NextFunction } from "express"
import passport from "passport"
import bcrypt from "bcryptjs"
import { body, validationResult } from "express-validator"
import User, { UserDocument } from "../models/userModel.js"
import { Strategy as LocalStrategy } from "passport-local"

// Set up Passport local strategy
passport.use('signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return done(null, false, { message: "Email is already taken." })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User({
                username: req.body.username,
                email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            })

            await newUser.save()

            return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    }
))

// Signup Controller with Validation and Passport.js
export const signup = [
    body("email")
        .isEmail().withMessage("Please enter a valid email address.")
        .normalizeEmail(),
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required.")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters.")
        .custom(async (value) => {
            const existingUser = await User.findOne({ username: value })
            if (existingUser) {
                throw new Error("Username is already taken.")
            }
            return true
        }),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
        .matches(/\d/).withMessage("Password must contain a number.")
        .matches(/[a-z]/).withMessage("Password must contain a lowercase letter.")
        .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character."),
    body("firstName")
        .notEmpty().withMessage("First name is required.")
        .isAlpha().withMessage("First name should only contain letters."),
    body("lastName")
        .notEmpty().withMessage("Last name is required.")
        .isAlpha().withMessage("Last name should only contain letters."),

    // Handle the request after validation
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // Call Passport.js signup strategy
        passport.authenticate('signup', async (err: Error | null, user: UserDocument | false, info: { message: string } | undefined) => {
            if (err) {
                return res.status(500).json({ message: "Server error during signup." })
            }

            if (!user) {
                return res.status(400).json({ message: info?.message || 'Authentication failed.' })
            }

            return res.status(201).json({
                message: "User registered successfully!",
                user: {
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            })
        })(req, res, next)
    },
]