import mongoose from "mongoose"

const connectMongoDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in the environment variables.")
        }

        const conn = await mongoose.connect(mongoURI)

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`)
        } else {
            console.error("Unknown error occurred during MongoDB connection.")
        }
        process.exit(1)
    }
}

export default connectMongoDB
