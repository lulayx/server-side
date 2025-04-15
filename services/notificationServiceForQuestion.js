// module.exports = NotificationService;
const db = require("../db/dbConfig");
const emailService = require("./emailService");

const NotificationService = {
  async notifyQuestionAuthor(questionId) {
    try {
      // Get question details
      const [question] = await db.query(
        "SELECT title, description, user_id FROM questiontable WHERE question_id = ?",
        [questionId]
      );

      if (!question[0]) {
        console.log("Question not found");
        return;
      }

      // Get author details
      const [author] = await db.query(
        "SELECT email, first_name FROM usertable WHERE user_id = ?",
        [question[0].user_id]
      );

      if (!author[0]) {
        console.log("Author not found");
        return;
      }

      // Construct the question URL
      // const questionUrl = `${process.env.FRONTEND_URL}/questions/${questionId}`;

      // Prepare email content
      const subject = `Your New Question: ${question[0].title}`;
      const message = `
        <h2>Hello ${author[0].first_name},</h2>
        <p>Thank you for posting your question on our platform!</p>
        <h3>Your question: ${question[0].title}</h3>
        <p>${question[0].description}</p>
        <p>We'll notify you when someone answers your question.</p>
        <p>Best regards,<br/>Evangadi Question and Answer Team</p>
      `;

      // Send notification to the author
      await emailService.sendNotification(author[0].email, subject, message);

      console.log("Notification sent to question author successfully");
    } catch (error) {
      console.error("Notification error:", error);
    }
  },
};

module.exports = NotificationService;
