require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

const teachers = [
  {
    firstName: "James",
    lastName: "Wilson",
    lessonTopics: ["Coding for Kids"],
    image: "http://localhost:3000/images/teachers/James-Wilson.png",
  },
  {
    firstName: "Daniel",
    lastName: "Taylor",
    lessonTopics: ["Football Club"],
    image: "http://localhost:3000/images/teachers/Daniel-Taylor.png",
  },
  {
    firstName: "Emma",
    lastName: "Carter",
    lessonTopics: ["Art & Creativity"],
    image: "http://localhost:3000/images/teachers/Emma-Carter.png",
  },
  {
    firstName: "Sarah",
    lastName: "Lee",
    lessonTopics: ["Piano Lessons"],
    image: "http://localhost:3000/images/teachers/Sarah-Lee.png",
  },
  {
    firstName: "Michael",
    lastName: "Davis",
    lessonTopics: ["Junior Basketball"],
    image: "http://localhost:3000/images/teachers/Michael-Davis.png",
  },
  {
    firstName: "David",
    lastName: "Smith",
    lessonTopics: ["Young Scientists"],
    image: "http://localhost:3000/images/teachers/David-Smith.png",
  },
  {
    firstName: "Andrew",
    lastName: "Clark",
    lessonTopics: ["Chess Club"],
    lastName: "Clark",
    image: "http://localhost:3000/images/teachers/Andrew-Clark.png",
  },
  {
    firstName: "Laura",
    lastName: "Adams",
    lessonTopics: ["English Workshop"],
    image: "http://localhost:3000/images/teachers/Laura-Adams.png",
  },
  {
    firstName: "Sophie",
    lastName: "Harris",
    lessonTopics: ["Kids Dance"],
    image: "http://localhost:3000/images/teachers/Sophie-Harris.png",
  },
  {
    firstName: "Robert",
    lastName: "Brown",
    lessonTopics: ["Maths Club"],
    image: "http://localhost:3000/images/teachers/Robert-Brown.png",
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
