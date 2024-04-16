const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail email address
        pass: process.env.EMAIL_PASS   // Your Gmail password
    }
});

// Function to send password reset email
module.exports.sendResetPasswordEmail = async (recipient, token) => {
    try {
        // Email message
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (must be the same as auth.user)
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


module.exports.verifyEmail = async(email, link) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS   
            }
        });
        let info = await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to: email,
            subject: "Account Verification",
            text: "Welcome",
            html:`
            <div>
            <a href=${link}>Click Hereto Verify Email</a>
            </div>
            `
        });
        console.log("Email sent successfully")
    }
    catch(error){
        console.error("Email sending failed", error);
    }
}


