const emailLayout = ({ title, content, ctaUrl, appName }) => `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
        line-height: 1.6;
    ">
        ${title ? `<h2>${title}</h2>` : ''}

        ${content}

        <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

        ${ctaUrl ? `
            <p style="font-size:12px; color:#777;">
                If the button doesn’t work, copy and paste this URL into your browser:
                <br/>
                <span style="word-break: break-all;">${ctaUrl}</span>
            </p>
        ` : ''}

        <p style="font-size:12px; color:#999; margin-top:20px;">
            Regards,<br/>
            ${appName} Team
        </p>
    </div>
`;

export default emailLayout;