import mongoose from "mongoose";


const rentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    dressType: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    rentalDate: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["published", "approved", "rejected", "other"],
        default: "published",
        required: true
    }
}, {timestamps: true})


const Rent = mongoose.model("Rent", rentSchema)


export default Rent