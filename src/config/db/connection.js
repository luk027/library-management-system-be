import mongoose from "mongoose";

export async function connectDB(URL) {
    await mongoose.connect(URL)
        .then(() => {
            console.log(`\nMongoDB Connected!`);
        })
        .catch((err) => {
            console.error('MongoDB Connection Error ->',err.message);
        });
}
