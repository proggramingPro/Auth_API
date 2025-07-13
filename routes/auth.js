const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/mailer');

const otpStore = {};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOtp();
    otpStore[email] = {otp, expiresAt: Date.now() + 5 * 60 * 1000};

    try {
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const data = otpStore[email];
   if (!data) return res.status(400).json({ message: 'OTP not found' });

  if (Date.now() > data.expiresAt) return res.status(400).json({ message: 'OTP expired' });

  if (otp !== data.otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email];
  res.json({ message: 'OTP verified successfully!' });
});

module.exports = router;
