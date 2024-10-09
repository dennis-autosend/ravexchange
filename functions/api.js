const express = require('express');
const serverless = require('serverless-http');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(mongoUri);
  const db = client.db('ravexchange');
  cachedDb = db;
  return db;
}

app.get('/api/tickets', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const tickets = await db.collection('tickets').find().toArray();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Add other endpoints (PUT, DELETE) here

module.exports.handler = serverless(app);