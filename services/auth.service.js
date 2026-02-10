import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// import sendEmail from '../utils/sendEmail.js';
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

    // const verificationUrl = `${process.env.APP_URL}/verify-email/${verificationToken}`;

    // await sendEmail({
    //     to: user.email,
    //     subject: 'Verify your email address',
    //     html: verificationEmailTemplate(user.name, verificationUrl)
    // });

    return user;
};
