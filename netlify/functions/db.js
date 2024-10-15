const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
    connectToDatabase: async function () {
        if (dbConnection) return dbConnection;

        try {
            await client.connect();
            dbConnection = client.db('ravexchange');
            console.log("Successfully connected to MongoDB.");
            return dbConnection;
        } catch (e) {
            console.error("Error connecting to MongoDB: ", e);
            throw e;
        }
    }
};