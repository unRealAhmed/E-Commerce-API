const nodemailer = require('nodemailer');
const EventEmitter = require('events');

const emailEventEmitter = new EventEmitter();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'E-Commerce Team <ahmed@ECommerce.io>';
  }

  // Send an email with specified subject and message
  async send(subject, message, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message || '',
      html
    };

    // Emit the 'sendEmail' event with mailOptions
    emailEventEmitter.emit('sendEmail', mailOptions);
  }

  async sendWelcomeEmail(html) {
    const subject = 'Welcome To E-Commerce Family 🚀';
    const message = "hi"
    await this.send(subject, message, html);
  }

  async sendPasswordResetEmail(html) {
    const subject = "Password Reset Request for Your E-Commerce Account 🛡️"
    const message = 'hi'
    await this.send(subject, message, html);
  }
};

emailEventEmitter.on('sendEmail', async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASS_KEY,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
