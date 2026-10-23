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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
  try {
    await client.connect();

    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectToDatabase();
