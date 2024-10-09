console.log('API function is loading');

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(mongoUri);
  const db = client.db('ravexchange'); // replace 'ravexchange' with your database name if different
  cachedDb = db;
  return db;
}

// Root path handler
app.get('/', (req, res) => {
  console.log('Root path accessed');
  res.json({ message: 'Welcome to the ravExchange API' });
});

// GET all tickets
app.get('/api/tickets', async (req, res) => {
  console.log('Fetching tickets');
  try {
    const db = await connectToDatabase();
    const tickets = await db.collection('tickets').find().toArray();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST a new ticket
app.post('/api/tickets', async (req, res) => {
  console.log('Creating new ticket');
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Catch-all route
app.use((req, res) => {
  console.log('404 - Not Found');
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Wrap the Express app with serverless
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  console.log('Function executed!', event.path);
  return await handler(event, context);
};
