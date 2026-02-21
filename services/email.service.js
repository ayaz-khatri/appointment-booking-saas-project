import sendEmail from '../utils/send-email.util.js';
import verificationEmailTemplate from '../templates/emails/verification-email.template.js';
import resetPasswordTemplate from '../templates/emails/reset-password.template.js';

export const sendVerificationEmail = async (user, verificationUrl) => {
    const html = verificationEmailTemplate(
        user.name,
        verificationUrl,
        process.env.APP_NAME
    );

    await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html
    });
};

export const sendResetPasswordEmail = async (user, resetUrl) => {
    const html = resetPasswordTemplate(user.name, resetUrl);

    await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html
    });
};