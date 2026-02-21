import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../utils/app-error.util.js';
import { ERRORS } from '../config/constants/error-messages.js';
import { sendVerificationEmail, sendResetPasswordEmail } from './email.service.js';

export const loginUserService = async ({ email, password, rememberMe }) => {
    const user = await User
        .findOne({ email, isDeleted: false })
        .select('+password');

    if (!user) throw new AppError(ERRORS.INVALID_CREDENTIALS, 401, true);

    if (!user.isEmailVerified) throw new AppError(ERRORS.EMAIL_NOT_VERIFIED, 401, true);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError(ERRORS.INVALID_CREDENTIALS, 401, true);

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

export const registerUserService = async ({ name, email, phone, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError(ERRORS.EMAIL_EXISTS, 401, true);

    const allowedRoles = ['customer'];
    const finalRole = allowedRoles.includes(role) ? role : 'customer';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role: finalRole
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    user.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const verificationUrl = `${process.env.APP_URL}/verify-email/${verificationToken}`;

    await sendVerificationEmail(user, verificationUrl);

    return user;
};

export const verifyEmailService = async (token) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        isDeleted: false,
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) throw new AppError(ERRORS.INVALID_TOKEN, 401, true);

    if (user.isEmailVerified) throw new AppError(ERRORS.EMAIL_ALREADY_VERIFIED, 401, true);

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return user;
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email, isDeleted: false });

    // Always return success message for security
    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(user, resetUrl);
};

export const resetPasswordService = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        isDeleted: false,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new AppError(ERRORS.INVALID_LINK, 401, true);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return true;
};