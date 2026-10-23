// express and connection string to MongoDB
const cors = require("cors");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("BeyondBell Backend is running");
});

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db("BeyondBellDB");

async function connectToDatabase() {
  try {
    await client.connect();

    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectToDatabase();

// Get Lessons Route

app.get("/lessons", async (req, res) => {
  try {
    const lessons = await database.collection("lessons").find({}).toArray();

    res.json(lessons);
  } catch (error) {
    console.error("Failed to get lessons:", error);

    res.status(500).json({
      message: "Failed to get lessons",
    });
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
