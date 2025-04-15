require("dotenv").config();
const dbConnection = require("./db/dbConfig");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 7700;

const corsOptions = {
  origin: "*", // This is too permissive for production
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // This should handle preflight

app.use(express.json());

//  routes middleware file
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");
const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
const adminAnswersRoutes = require("./routes/adminAnswerRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");
//authentication routes middleware file

// user routes middleware
app.use("/api/users", userRoutes);

// post Question middleware
app.use("/api", authMiddleware, questionRoute);

//get single, all question routes middleware
app.use("/api/questions", authMiddleware, questionRoute);

//delete  or edit question  routes middleware
app.use("/api/questions", authMiddleware, questionRoute);

//post answers routes middleware
app.use("/api", authMiddleware, answerRoutes);

// get answers, delete, edit,rating answers  routes middleware
app.use("/api/answers", authMiddleware, answerRoutes);

//  post answer middleware
app.use("/api", authMiddleware, answerRoutes);

// admin routes middleware for user registration and  management
app.use("/api/admin", adminRoutes);

// 2. Admin Routes with Middleware for Questions
app.use("/api/admin/questions", adminQuestionRoutes);

//admin routes with middleware for answer delete and edit
app.use("/api/admin", adminAnswersRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    app.listen(port);
    console.log("Database connection established");
    console.log(`listening on ${port} `);
  } catch (error) {
    console.log(error.message);
  }
}

start();
