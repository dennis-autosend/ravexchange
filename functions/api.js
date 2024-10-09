const express = require('express');
const serverless = require('serverless-http');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('ravexchange'); // replace 'ravexchange' with your database name if different
  cachedDb = db;
  return db;
}

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ravExchange API' });
});

// GET all tickets
app.get('/api/tickets', async (req, res) => {
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
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PUT (update) a ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: req.body },
      { returnOriginal: false }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// DELETE a ticket
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('tickets').findOneAndDelete({ _id: ObjectId(req.params.id) });
    if (result.value) {
      res.json({ message: 'Ticket deleted successfully' });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Handle ticket purchase
app.post('/api/purchase', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { ticketId } = req.body;
    const result = await db.collection('tickets').findOneAndUpdate(
      { _id: ObjectId(ticketId), sold: false },
      { $set: { sold: true } },
      { returnOriginal: false }
    );
    if (result.value) {
      res.json({ message: 'Ticket purchased successfully', ticket: result.value });
    } else {
      res.status(400).json({ error: 'Ticket not available' });
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports.handler = serverless(app);