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

export default resetPasswordTemplate;