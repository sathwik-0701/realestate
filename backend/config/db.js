import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://psrpsr1432_db_user:sathwik123@cluster0.dzmouho.mongodb.net/RealState")
    .then(() => {
        console.log("DB CONNECTED")
    })
}