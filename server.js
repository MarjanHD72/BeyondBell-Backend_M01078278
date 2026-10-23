// express and connection string to MongoDB
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Static Image Middleware
app.use("/images", express.static("images"));

// Image Error Middleware
app.use("/images", (req, res) => {
  res.status(404).json({
    message: "Image not found",
  });
});

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

// Update Lesson Route
app.put("/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updatedLesson = req.body;

    const result = await database
      .collection("lessons")
      .updateOne({ _id: new ObjectId(lessonId) }, { $set: updatedLesson });

    res.json({
      message: "Lesson updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Failed to update lesson:", error);

    res.status(500).json({
      message: "Failed to update lesson",
    });
  }
});

// Create Order Route
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;

    const result = await database.collection("orders").insertOne(order);

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create order:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
