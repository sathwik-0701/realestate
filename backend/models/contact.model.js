import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String 
    },
    role: {
        type: String,
        enum: ["buyer", "seller", "guest"],
        default: "guest"
    },
    subject: {
        type: String,
        default: "General Inquiry"
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);