const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { eventName, price, description, sellerId } = JSON.parse(event.body);

    if (!eventName || !price || !description || !sellerId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    try {
        await client.connect();
        const database = client.db('ravexchange');
        const tickets = database.collection('tickets');

        const result = await tickets.insertOne({
            eventName,
            price: parseFloat(price),
            description,
            sellerId,
            status: 'available',
            createdAt: new Date()
        });

        return {
            statusCode: 201,
            body: JSON.stringify({ success: true, ticketId: result.insertedId })
        };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create ticket' })
        };
    } finally {
        await client.close();
    }
};