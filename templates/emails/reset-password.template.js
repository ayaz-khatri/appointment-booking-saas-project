import emailLayout from './layout.template.js';

const resetPasswordTemplate = (name, url, appName) => {
    const content = `
        <p>Hello ${name},</p>

        <p>You requested a password reset for your ${appName} account.</p>

        <div style="margin:20px 0;">
            <a href="${url}"
               style="
                   background:#dc3545;
                   color:#fff;
                   padding:12px 18px;
                   text-decoration:none;
                   border-radius:5px;
                   display:inline-block;
                   font-weight:bold;
               ">
               Reset Password
            </a>
        </div>

        <p>This link will expire in <strong>15 minutes</strong>.</p>

        <p>If you did not request this reset, you can safely ignore this email.</p>
    `;

    return emailLayout({
        title: null,
        content,
        ctaUrl: url,
        appName
    });
};

export default resetPasswordTemplate;