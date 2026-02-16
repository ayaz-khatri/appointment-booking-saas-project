import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },

    password: {
        type: String,
        required: true,
        required: function () {
            return this.authProvider === 'local';
        }
    },

    phone: {
        type: String
    },

    googleId: {
        type: String,
        default: null
    },

    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },

    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },

    profilePic: { 
        url: { type: String, default: null },
        publicId: { type: String, default: null}
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    },

    lastLogin: {
        type: Date
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationToken: {
        type: String
    },

    emailVerificationExpires: {
        type: Date
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    }

},
{
    timestamps: true
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);
export default User;
