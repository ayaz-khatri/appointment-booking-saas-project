import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUserService = async ({ email, password, rememberMe }) => {
    const user = await User
        .findOne({ email, isDeleted: false })
        .select('+password');

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isEmailVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const tokenExpiry = rememberMe ? '30d' : '1d';
    const jwtData = { id: user._id, role: user.role };

    const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
    });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return {
        user,
        token
    };
};
