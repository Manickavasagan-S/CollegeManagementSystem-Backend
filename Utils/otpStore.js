/**
 * In-memory OTP store.
 * Structure: { email -> { otp, expiresAt } }
 * OTPs expire after 10 minutes.
 */
const store = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function saveOtp(email, otp) {
    store.set(email.toLowerCase(), {
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
    });
}

function verifyOtp(email, otp) {
    const record = store.get(email.toLowerCase());
    if (!record) return { valid: false, reason: 'No OTP requested for this email' };
    if (Date.now() > record.expiresAt) {
        store.delete(email.toLowerCase());
        return { valid: false, reason: 'OTP has expired. Please request a new one.' };
    }
    if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
    store.delete(email.toLowerCase()); // one-time use
    return { valid: true };
}

module.exports = { saveOtp, verifyOtp };
