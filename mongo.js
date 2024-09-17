const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

const url = "mongodb://localhost:27017"; // Your MongoDB server address
const dbName = "myMongoDB"; // Database name
let db;

// Function to initialize the MongoDB connection
const initializeDbConnection = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if we can't connect to the database
  }
};

// Initialize the MongoDB connection before starting the server
initializeDbConnection().then(() => {
  // Define routes only after the DB connection is established
  app.get("/create", async (req, res) => {
    console.log("Received GET request to /create");

    const data = { name: "John Doe", email: "john@example.com" };
    try {
      const result = await db.collection("users").insertOne(data);
      res.status(201).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to create user: ${error.message}` });
    }
  });

  app.get("/users", async (req, res) => {
    console.log("Received GET request to /users");

    try {
      const users = await db.collection("users").find({}).toArray();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to retrieve users: ${error.message}` });
    }
  });

  // Start the server only after the DB connection is established
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
