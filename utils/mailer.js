const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
        }
});

async function sendEmail(to, otp) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: ", info.response);
  console.log("Message ID:", info.messageId);
  console.log("Preview URL (Ethereal only):", nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail;