const { Pool } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

const pgConif = {
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  ssl: {
    require: true,
  },
};

const pool = new Pool(pgConif);

// app.get("/", async (req, res) => {
//   res.status(200).send({ message: "successful" });
// });

app.get("/users", async (req, res) => {
  const client = await pool.connect();
  try {
    client.query(`SELECT version()`);
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
  res.status(200).send({ message: "success" });
});

app.post("/add-user", async (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  const client = await pool.connect();
  const Query = `INSERT INTO users (name, id, email) VALUES ('${newUser.name}','${newUser.id}','${newUser.email}')`;
  try {
    client.query(Query);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }

  res.status(200).send({ message: "User Added successfully" });
});

app.post("/add-transaction", async (req, res) => {
  const newTransaction = req.body;
  const client = await pool.connect();
  const Query = `INSERT INTO transaction (id, user_id, description) VALUES ('${newTransaction.id}', '${newTransaction.user_id}', '${newTransaction.description}')`;
  try {
    client.query(Query);
    console.log(newTransaction);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
  res.status(200).send({ message: "Transaction added" });
});

app.get("/init", async (req, res) => {
  const client = await pool.connect();
  // "CREATE TABLE users (ID VARCHAR(255) PRIMARY KEY, email VARCHAR(255), name VARCHAR(255), password VARCHAR(255), createdAt VARCHAR(255), updatedAt VARCHAR(255), currencyType VARCHAR(255))"
  try {
    client.query(
      "CREATE TABLE transaction (ID VARCHAR(255) PRIMARY KEY, user_id VARCHAR(255), FOREIGN KEY(user_id) REFERENCES users(ID), description VARCHAR(255))"
    );
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }

  res.status(200).send({ message: "success" });
});

app.get("/delete", async (req, res) => {
  const client = await pool.connect();
  try {
    client.query("DROP TABLE newtable2");
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
  res.status(200).send({ message: "deleted users" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
