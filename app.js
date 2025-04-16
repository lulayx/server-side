// require("dotenv").config();
// const dbConnection = require("./db/dbConfig");
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const port = 7700;

// // const corsOptions = {
// //   origin: "*", // This is too permissive for production
// //   credentials: false,
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// //   optionsSuccessStatus: 204,
// // };

// // app.use(cors(corsOptions));
// // app.options("*", cors(corsOptions)); // This should handle preflight

// const corsOptions = {
//   origin: "https://evangadi.lulayx.com", // Replace with your exact frontend origin
//   // credentials: false,
//   // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   // optionsSuccessStatus: 204,
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));


// app.use(express.json());

// //  routes middleware file
// const userRoutes = require("./routes/userRoute");
// const adminRoutes = require("./routes/adminRoutes");
// const questionRoute = require("./routes/questionRoutes");
// const answerRoutes = require("./routes/answerRoute");
// const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
// const adminAnswersRoutes = require("./routes/adminAnswerRoutes");
// const { authMiddleware } = require("./middleware/authMiddleware");
// //authentication routes middleware file

// // user routes middleware
// app.use("/api/users", userRoutes);

// // post Question middleware
// app.use("/api", authMiddleware, questionRoute);

// //get single, all question routes middleware
// app.use("/api/questions", authMiddleware, questionRoute);

// //delete  or edit question  routes middleware
// app.use("/api/questions", authMiddleware, questionRoute);

// //post answers routes middleware
// app.use("/api", authMiddleware, answerRoutes);

// // get answers, delete, edit,rating answers  routes middleware
// app.use("/api/answers", authMiddleware, answerRoutes);

// //  post answer middleware
// app.use("/api", authMiddleware, answerRoutes);

// // admin routes middleware for user registration and  management
// app.use("/api/admin", adminRoutes);

// // 2. Admin Routes with Middleware for Questions
// app.use("/api/admin/questions", adminQuestionRoutes);

// //admin routes with middleware for answer delete and edit
// app.use("/api/admin", adminAnswersRoutes);

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// async function start() {
//   try {
//     const result = await dbConnection.execute("select 'test' ");
//     app.listen(port);
//     console.log("Database connection established");
//     console.log(`listening on ${port} `);
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// start();


require("dotenv").config();
const dbConnection = require("./db/dbConfig");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 7700;

// Define allowed origins (adjust these for your actual frontend domains)
const allowedOrigins = [
  "http://localhost:7700",
  "https://your-production-domain.com", // production
];

// !origin means: this request probably isn't coming from a browser with a cross-origin source → allow it.
// allowedOrigins.includes(origin) ->This checks: “Is the request’s origin listed in our allowedOrigins array?”
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); //Tells CORS: this origin is allowed.
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // Allows cookies, authorization headers, and TLS client certificates.
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  //Only these headers can be sent from the frontend.
  allowedHeaders: ["Content-Type", "Authorization"],

  // Ensures a 204 No Content response is returned for **preflight requests(you're allowed to proceed) ,
  optionsSuccessStatus: 204,
};

// Apply CORS globally
app.use(cors(corsOptions));
app.use(express.json());

// -------- Routes -------- //
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");
const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
const adminAnswersRoutes = require("./routes/adminAnswerRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");

// User routes
app.use("/api/users", userRoutes);

// Question routes
app.use("/api", authMiddleware, questionRoute);
app.use("/api/questions", authMiddleware, questionRoute);

// Answer routes
app.use("/api", authMiddleware, answerRoutes);
app.use("/api/answers", authMiddleware, answerRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/admin", adminAnswersRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
async function start() {
  try {
    await dbConnection.execute("select 'test'");
    app.listen(port, () => {
      console.log("Database connection established");
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to DB:", error.message);
  }
}

start();