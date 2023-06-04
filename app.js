const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://wa258306:34DBR02kKFMtxnEf@cluster0.xu3mfp6.mongodb.net/?retryWrites=true&w=majority";

// Connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'mongodbAssignment';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to generate a random number between min and max (inclusive)
function getRandomScore(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate a random date within a range of years
function getRandomDate(startYear, endYear) {
  const startDate = new Date(startYear, 0, 1).getTime();
  const endDate = new Date(endYear, 11, 31).getTime();
  const randomTimestamp = Math.floor(Math.random() * (endDate - startDate + 1) + startDate);
  return new Date(randomTimestamp);
}

// Function to generate a random restaurant name starting with Cafeteria
function getRandomRestaurantName() {
  const prefixes = ['Cafeteria', 'Café', 'Coffee House'];
  const suffixes = ['Bistro', 'Diner', 'Restaurant'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix}`;
}

// Function to generate a random document based on the provided schema
function generateRandomDocument() {
  const randomScore = getRandomScore(81, 99);
  const randomDate = getRandomDate(2010, 2023);
  const randomName = getRandomRestaurantName();

  return {
    address: {
      building: "1007",
      coord: [-73.856077, 40.848447],
      street: "Mall Road Mussorrie",
      zipcode: "10462"
    },
    cuisine: "Bakery",
    grades: [
      { date: { $date: randomDate.getTime() }, grade: "A", score: randomScore }
    ],
    name: randomName,
    restaurant_id: Math.floor(Math.random() * 100000).toString()
  };
}

// Number of documents to be inserted
const numDocuments = 20;

// Connect to the MongoDB server
client.connect(function (err) {
  if (err) {
    console.error('Error occurred while connecting to MongoDB:', err);
    return;
  }

  console.log('Connected successfully to MongoDB');

  // Select the database
  const db = client.db(dbName);

  // Get the 'restaurant' collection
  const collection = db.collection('restaurant');

  // Generate and insert the documents
  const documents = [];
  for (let i = 0; i < numDocuments; i++) {
    const document = generateRandomDocument();
    documents.push(document);
  }

  collection.insertMany(documents, function (err, result) {
    if (err) {
      console.error('Error occurred while inserting documents:', err);
    } else {
      console.log(`${result.insertedCount} documents inserted successfully`);
    }

    // Close the connection
    client.close();
  });
});


// 1) Write a MongoDB query to display the fields restaurant_id, name, and zip code
// but exclude the field _id for all the documents in the collection restaurant.
db.restaurant.find({}, { _id: 0, restaurant_id: 1, name: 1, "address.zipcode": 1 })

// Write a MongoDB query to arrange the name of the restaurants in ascending order along with all the columns.
db.restaurant.find().sort({ name: 1 })

// Write a MongoDB query to display the first 5 restaurant in ascending order of name field.
db.restaurant.find().sort({ name: 1 }).limit(5)

// Write a MongoDB query to display the next 5 restaurants after skipping first 5.
db.restaurant.find().sort({ name: 1 }).skip(5).limit(5)

// Write a MongoDB query to find the restaurants who achieved a score more than 90.
db.restaurant.find({ "grades.score": { $gt: 90 } })

// Write a MongoDB query to find the restaurants that achieved a score, more than 80 but less than 100.
db.restaurant.find({ "grades.score": { $gt: 80, $lt: 100 } })

// Write a MongoDB query to find the restaurant name, longitude and latitude and cuisine for those restaurants which contain 'Caf' as first three letters of its name.
db.restaurant.find({ name: /^Caf/ }, { name: 1, "address.coord": 1, cuisine: 1 })

// Write a MongoDb query to update grade B to A in all documents.
db.restaurant.updateMany(
  { "grades.grade": "B" },
  { $set: { "grades.$.grade": "A" } }
)