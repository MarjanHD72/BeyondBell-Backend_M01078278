require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

const teachers = [
  {
    firstName: "James",
    lastName: "Wilson",
    lessonTopics: ["Coding for Kids"],
  },
  {
    firstName: "Daniel",
    lastName: "Taylor",
    lessonTopics: ["Football Club"],
  },
  {
    firstName: "Emma",
    lastName: "Carter",
    lessonTopics: ["Art & Creativity"],
  },
  {
    firstName: "Sarah",
    lastName: "Lee",
    lessonTopics: ["Piano Lessons"],
  },
  {
    firstName: "Michael",
    lastName: "Davis",
    lessonTopics: ["Junior Basketball"],
  },
  {
    firstName: "David",
    lastName: "Smith",
    lessonTopics: ["Young Scientists"],
  },
  {
    firstName: "Andrew",
    lastName: "Clark",
    lessonTopics: ["Chess Club"],
  },
  {
    firstName: "Laura",
    lastName: "Adams",
    lessonTopics: ["English Workshop"],
  },
  {
    firstName: "Sophie",
    lastName: "Harris",
    lessonTopics: ["Kids Dance"],
  },
  {
    firstName: "Robert",
    lastName: "Brown",
    lessonTopics: ["Maths Club"],
  },
];

async function seedTeachers() {
  try {
    await client.connect();

    const database = client.db("BeyondBellDB");

    const result = await database.collection("teachers").insertMany(teachers);

    console.log(`${result.insertedCount} teachers added`);
  } catch (error) {
    console.error("Failed to add teachers:", error);
  } finally {
    await client.close();
  }
}

seedTeachers();
