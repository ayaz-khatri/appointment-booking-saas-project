import transporter from './mail.util.js';
import { ENV } from '../config/env.config.js';

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"${ENV.app.name}" <${ENV.mail.user}>`,
        to,
        subject,
        html
    });
};

export default sendEmail;
