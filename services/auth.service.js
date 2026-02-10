import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/send-email.util.js';
// import verificationEmailTemplate from '../emails/verificationEmailTemplate.js';

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

export const registerUserService = async ({ name, email, phone, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('EMAIL_EXISTS');
    }

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

    await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: verificationEmailTemplate(user.name, verificationUrl)
    });

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

    if (!user) {
        throw new Error('INVALID_OR_EXPIRED_TOKEN');
    }

    if (user.isEmailVerified) {
        throw new Error('EMAIL_ALREADY_VERIFIED');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return user;
};


const verificationEmailTemplate = (name, url) => `
    <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with <b>${process.env.APP_NAME}</b>.</p>
        <p>Please verify your email address by clicking the button below:</p>
        <p>
            <a href="${url}" 
               style="background:#28a745;color:#fff;padding:10px 15px;
               text-decoration:none;border-radius:5px;">
               Verify Email
            </a>
        </p>
        <p>This link will expire in 24 hours.</p>
        <p>Regards,<br/>Support Team</p>
    </div>
`;

const resetPasswordTemplate = (name, url) => `
    <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>You requested a password reset.</p>
        <p>Click the button below to set a new password:</p>
        <p>
            <a href="${url}"
               style="background:#dc3545;color:#fff;
               padding:10px 15px;text-decoration:none;border-radius:5px;">
               Reset Password
            </a>
        </p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
    </div>
`;