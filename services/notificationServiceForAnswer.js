const { sendNotification } = require("./emailService");
const dbConnection = require("../db/dbConfig");

const notifyQuestionAskerAboutNewAnswer = async (
  questionId,
  answerText,
  answeringUserId
) => {
  try {
    // Get the question details and asker's information
    const [question] = await dbConnection.query(
      `SELECT q.title, q.description, u.user_id AS asker_id, u.email, u.first_name AS asker_name 
       FROM questiontable q
       JOIN usertable u ON q.user_id = u.user_id
       WHERE q.question_id = ?`,
      [questionId]
    );

    if (!question || question.length === 0) {
      console.error("Question not found");
      return false;
    }

    const questionData = question[0];

    // Don't notify if the asker is the one answering their own question
    if (questionData.asker_id === answeringUserId) {
      console.log(
        "Asker is answering their own question - no notification needed"
      );
      return true;
    }

    // Get the answering user's details
    const [answeringUser] = await dbConnection.query(
      `SELECT user_name FROM usertable WHERE user_id = ?`,
      [answeringUserId]
    );

    if (!answeringUser || answeringUser.length === 0) {
      console.error("Answering user not found");
      return false;
    }

    const answeringUserName = answeringUser[0].user_name;
    const questionTitle = questionData.title || questionData.description;
    const siteUrl = "https://evangadi.digitalyibeltal.com";

    // Prepare email content
    const subject = `New Answer to Your Question: ${questionTitle}`;
    const message = `
      <h2>Hello ${questionData.asker_name},</h2>
      <p>Your question <strong>"${questionTitle}"</strong> has received a new answer!</p>
      <p><strong>${answeringUserName}</strong> responded:</p>
      <blockquote>${answerText}</blockquote>
      <p>Login to view the answer and participate in the discussion: <a href="${siteUrl}">${siteUrl}</a></p>
      <p>Best regards,<br/>Evangadi Q&A Team</p>
    `;

    // Send notification to the question asker
    await sendNotification(questionData.email, subject, message);

    console.log(`Notification sent to question asker: ${questionData.email}`);
    return true;
  } catch (error) {
    console.error("Error in notification service:", error);
    return false;
  }
};

module.exports = { notifyQuestionAskerAboutNewAnswer };
