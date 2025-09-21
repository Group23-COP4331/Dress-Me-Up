// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

// assign module handle
const sgMail = require('@sendgrid/mail');

// set API key to sendgrid module handle
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// send email verification function
const sendEmailVerification = async (userEmail, verificationLink) => {

    console.log(`verification link is ${verificationLink}`);
    // email contents
    const msg = {
        to: userEmail,
        from: 'dressmeupprojectemail@gmail.com',
        subject: 'Verify Your Email for DressMeUp!',
        html: `<p>Click the following link to verify your email for DressMeUp!</p>
        <a href="${verificationLink}">Verify Email</a>`
    }

    // look out for any errors
    try {
        await sgMail.send(msg);
        console.log('Email sent'); 
    } catch (error) {
        console.error(error);
    }
}

// export the function 
module.exports = sendEmailVerification;