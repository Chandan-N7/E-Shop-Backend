const mongoose = require("mongoose");
const { genSalt, hash } = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    otp: String, // Temporary OTP storage
    verified: {
        type: Boolean,
        default: false,
    },
})

userSchema.pre("save", async function (next) {
    const user = this;
    
    // Hash the password only if it's new or modified
    if (!user.isModified('password')) return next();
    
    try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User