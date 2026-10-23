require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

const lessons = [
  {
    topic: "Coding for Kids",
    location: "Edgware",
    price: 15,
    space: 8,
    type: "Class",
    teacher: "Mr Wilson",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    topic: "Football Club",
    location: "Mill Hill",
    price: 12,
    space: 5,
    type: "Activity",
    teacher: "Coach Taylor",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
  },
  {
    topic: "Art & Creativity",
    location: "Hendon",
    price: 14,
    space: 6,
    type: "Class",
    teacher: "Ms Carter",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
  },
  {
    topic: "Piano Lessons",
    location: "Barnet",
    price: 18,
    space: 4,
    type: "Class",
    teacher: "Mrs Lee",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
  },
  {
    topic: "Junior Basketball",
    location: "Finchley",
    price: 13,
    space: 7,
    type: "Activity",
    teacher: "Mr Davis",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
  },
  {
    topic: "Young Scientists",
    location: "Colindale",
    price: 16,
    space: 3,
    type: "Class",
    teacher: "Dr Smith",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
  },
  {
    topic: "Chess Club",
    location: "Edgware",
    price: 10,
    space: 5,
    type: "Activity",
    teacher: "Mr Clark",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461",
  },
  {
    topic: "English Workshop",
    location: "Hendon",
    price: 13,
    space: 9,
    type: "Class",
    teacher: "Ms Adams",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  },
  {
    topic: "Kids Dance",
    location: "Mill Hill",
    price: 12,
    space: 4,
    type: "Activity",
    teacher: "Ms Harris",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
  },
  {
    topic: "Maths Club",
    location: "Finchley",
    price: 11,
    space: 6,
    type: "Class",
    teacher: "Mr Brown",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904",
  },
];

async function seedLessons() {
  try {
    await client.connect();

    const database = client.db("BeyondBellDB");
    const collection = database.collection("lessons");

    await collection.insertMany(lessons);

    console.log("Lessons added successfully");
  } catch (error) {
    console.error("Failed to add lessons:", error);
  } finally {
    await client.close();
  }
}

seedLessons();