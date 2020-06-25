const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
            user: "724d23caa51e14",
            pass: "6371160032a134",
        },
    });
    return await transporter.sendMail({
        from: '"Cannes Is Up" <adhesion@cannesisup.com>',
        to: email,
        subject: subject,
        html: message
    });
};

module.exports = sendEmail;