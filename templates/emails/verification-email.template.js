const verificationEmailTemplate = (name, url, appName) => `
    <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with <b>${appName}</b>.</p>
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

export default verificationEmailTemplate;