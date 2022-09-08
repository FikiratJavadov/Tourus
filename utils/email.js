const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Fikiratr Javadov (fikret@mail.ru)",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
