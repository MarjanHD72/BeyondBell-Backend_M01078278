// express and connection string to MongoDB
const cors = require("cors");
require("dotenv").config();
// Encripting Passwprd
const bcrypt = require("bcrypt");
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

// Search Lessons Route
app.get("/lessons/search", async (req, res) => {
  try {
    const searchText = req.query.q; //Gets the search text from the URL query

    const lessons = await database
      .collection("lessons")
      .find({
        $or: [
          { topic: { $regex: searchText, $options: "i" } },
          { location: { $regex: searchText, $options: "i" } },
          { type: { $regex: searchText, $options: "i" } },
          { teacher: { $regex: searchText, $options: "i" } },
        ],
      })
      .toArray();

    res.json(lessons);
  } catch (error) {
    console.error("Failed to search lessons:", error);

    res.status(500).json({
      message: "Failed to search lessons",
    });
  }
});

// Get Teachers Route
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await database.collection("teachers").find({}).toArray();

    res.json(teachers);
  } catch (error) {
    console.error("Failed to get teachers:", error);

    res.status(500).json({
      message: "Failed to get teachers",
    });
  }
});

// Get Lessons for a Teacher
app.get("/teachers/:id/lessons", async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacher = await database
      .collection("teachers")
      .findOne({ _id: new ObjectId(teacherId) });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const lessons = await database
      .collection("lessons")
      .find({
        topic: { $in: teacher.lessonTopics },
      })
      .toArray();

    res.json(lessons);
  } catch (error) {
    console.error("Failed to get teacher lessons:", error);

    res.status(500).json({
      message: "Failed to get teacher lessons",
    });
  }
});

// Get Enrolment for a Lesson
app.get("/enrolment/:lessonid", async (req, res) => {
  try {
    const lessonId = req.params.lessonid;

    const orders = await database
      .collection("orders")
      .find({
        "items.lessonId": lessonId,
      })
      .toArray();

    let totalEnrolment = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.lessonId === lessonId) {
          totalEnrolment += item.spaces;
        }
      });
    });

    res.json({
      lessonId: lessonId,
      enrolment: totalEnrolment,
    });
  } catch (error) {
    console.error("Failed to get enrolment:", error);

    res.status(500).json({
      message: "Failed to get enrolment",
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

// Register User Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await database
      .collection("users")
      .findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    const result = await database.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});
console.log("Register route loaded");

// Login User Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await database.collection("users").findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// Start Server - keep this last
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
