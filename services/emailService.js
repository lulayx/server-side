const nodemailer = require("nodemailer");

// Configure transporter with additional options
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs (helpful for local testing)
    rejectUnauthorized: false,
  },
});

// Add connection verification
transporter.verify((error) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    // console.log("SMTP Server is ready to send emails");
  }
});

const sendNotification = async (recipient, subject, message) => {
  try {
    const mailOptions = {
      from: `"Evangadi Q&A" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: subject,
      html: message,
      // Add priority header for better delivery
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipient}`, info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", {
      recipient,
      error: error.message,
      stack: error.stack,
    });

    // Specific handling for common errors
    if (error.code === "ECONNECTION" || error.code === "EDNS") {
      console.error("Network/DNS Error - Check your internet connection");
    } else if (error.responseCode === 535) {
      console.error("Authentication Error - Check your email credentials");
    }

    return false;
  }
};

module.exports = { sendNotification };
