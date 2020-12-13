const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })


const sendEmail = async (options) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });

    // send mail with defined transport object
    const message = {
        from: 'osamadeveloper1@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    const info = await transporter.sendMail(message)

}

module.exports = sendEmail