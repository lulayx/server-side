const mysql2 = require("mysql2");
const express = require("express");
const app = express();

const dbConnection = mysql2.createPool({
  // user: process.env.USER,
  // database: process.env.DATABASE,
  // host: process.env.LOCALHOST,
  // password: process.env.PASSWORD,

  //for remote
  password: "P6#S[R;t",
  database: "u703486725_Evangadi",
  user: "u703486725_evangadiforum",
  host: "195.35.38.91",

  // password: "123456",
  // database: "evangadi_forum",
  // user: "evangadi-admin",
  // host: "localhost",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306,
  // connectTimeout: 20000,
});
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database!");
  connection.release();
});

// for table creation
// eyasunigussie28@gmail.com
// GET is used to request data from a specified resource.

app.get("/install", (req, res) => {
  let createusertable = `CREATE TABLE IF NOT EXISTS usertable (
    user_id INT(20) AUTO_INCREMENT NOT NULL,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
  is_banned tinyint(1) DEFAULT '0',
  reset_token varchar(255) DEFAULT NULL,
  reset_token_expiry datetime DEFAULT NULL,
  is_admin tinyint(1) DEFAULT '0'
)`;

  let createquestiontable = `CREATE TABLE IF NOT EXISTS questiontable (
    user_id INT(20),
    question_id INT(20) AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (question_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usertable(user_id)
)`;

  let createanswertable = `CREATE TABLE IF NOT EXISTS answertable (
   answer_id INT(20) AUTO_INCREMENT NOT NULL,
    user_id INT(20),
    question_id INT(20),
    answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (question_id) REFERENCES questiontable(question_id),
    FOREIGN KEY (user_id) REFERENCES usertable(user_id),
     average_rating decimal(3,2) DEFAULT '0.00'
)`;

  let answerRating = `CREATE TABLE IF NOT EXISTS answer_ratings (
rating_id int(11) NOT NULL AUTO_INCREMENT,
  answer_id int(20) DEFAULT NULL,
  user_id int(20) DEFAULT NULL,
  rating tinyint(4) DEFAULT NULL,
  PRIMARY KEY (rating_id),
  FOREIGN KEY (answer_id) REFERENCES answertable(answer_id),
  FOREIGN KEY (user_id) REFERENCES usertable(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;
// the best website 
  dbConnection.query(createusertable, (err) => {
    if (err) return res.status(500).send("Error creating usertable: " + err);

    dbConnection.query(createquestiontable, (err) => {
      if (err)
        return res.status(500).send("Error creating questionTabel: " + err);

      dbConnection.query(createanswertable, (err) => {
        if (err)
          return res.status(500).send("Error creating answertable: " + err);

        dbConnection.query(answerRating, (err) => {
          if (err)
            return res.status(500).send("Error creating answer_rating: " + err);

          res.send("All tables created successfully!");
        });
      });
    });
  });
});

// //for table creation port number only
app.listen(2026, () => console.log("listening to: port localhost:2026,"));

module.exports = dbConnection.promise();
