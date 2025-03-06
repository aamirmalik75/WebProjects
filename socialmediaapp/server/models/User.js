import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 5,
        max: 60,
    },
    lastName: {
        type: String,
        required: true,
        min: 5,
        max: 60,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 60,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    picturePath: {
        type: String,
        default: '',
    },
    friends: {
        type: Array,
        default: [],
    },
    location: {
        type: String,
    },
    occupation: {
        type: String,
    },
    viewedProfile: {
        type: Number,
    },
    impressions: {
        type: Number,
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
export default User;