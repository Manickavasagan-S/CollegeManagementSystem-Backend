const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send a 6-digit OTP to the given email address.
 */
async function sendOtpEmail(toEmail, otp) {
    await transporter.sendMail({
        from: `"Student Portal" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Your Password Reset OTP',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#101935;margin-bottom:8px;">Password Reset</h2>
                <p style="color:#4b5563;">Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
                <div style="font-size:2.2rem;font-weight:700;letter-spacing:10px;color:#0f2fd5;text-align:center;margin:28px 0;">
                    ${otp}
                </div>
                <p style="color:#9ca3af;font-size:0.85rem;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    });
}

module.exports = { sendOtpEmail };
