// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailVerification = async (userEmail, verificationLink) => {
    const msg = {
        to: userEmail, // Change to your recipient
        from: 'dressmeupprojectemail@gmail.com', // Change to your verified sender
        subject: 'Verify Your Email for DressMeUp!',
        html: `<p>Click the following link to verify your email for DressMeUp!</p>
        <a href="${verificationLink}">Verify Email</a>`
      }

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error(error);
    }
}

module.exports = sendEmailVerification;