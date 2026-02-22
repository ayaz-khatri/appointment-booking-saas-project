import nodemailer from 'nodemailer';
import { ENV } from '../config/env.config.js';

const transporter = nodemailer.createTransport({
    host: ENV.mail.host,
    port: ENV.mail.port,
    secure: false, // TLS
    auth: {
        user: ENV.mail.user,
        pass: ENV.mail.pass
    }
});

export default transporter;
