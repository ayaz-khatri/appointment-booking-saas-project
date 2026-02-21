import emailLayout from './layout.template.js';

const verificationEmailTemplate = (name, url, appName) => {
    const content = `
        <p>Hello ${name},</p>

        <p>Thank you for registering with <strong>${appName}</strong>.</p>

        <div style="margin:20px 0;">
            <a href="${url}" 
               style="
                   background:#28a745;
                   color:#fff;
                   padding:12px 18px;
                   text-decoration:none;
                   border-radius:5px;
                   display:inline-block;
                   font-weight:bold;
               ">
               Verify Email
            </a>
        </div>

        <p>This link will expire in <strong>24 hours</strong>.</p>

        <p>If you did not create this account, you can safely ignore this email.</p>
    `;

    return emailLayout({
        title: null,
        content,
        ctaUrl: url,
        appName
    });
};

export default verificationEmailTemplate;