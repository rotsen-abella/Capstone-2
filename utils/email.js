const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', // Your Gmail email address
        pass: 'your_email_password'   // Your Gmail password
    }
});

// Function to send password reset email
exports.sendResetPasswordEmail = async (recipient, token) => {
    try {
        // Email message
        const mailOptions = {
            from: 'your_email@gmail.com', // Sender address (must be the same as auth.user)
            to: recipient,                // Recipient address
            subject: 'Password Reset',    // Email subject
            text: `Click the link below to reset your password:\n\nhttp://yourwebsite.com/reset-password?token=${token}` // Email body
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
}

module.exports = { hashPassword };

const sendResetPasswordEmail = async (email, token) => {
    // Your code to send the reset password email
};

module.exports = { sendResetPasswordEmail };
