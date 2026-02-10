import transporter from './mail.util.js';
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html
    });
};

export default sendEmail;
