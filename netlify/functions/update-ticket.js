const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    try {
        const database = await connectToDatabase();
        const tickets = database.collection('tickets');

        const { id, eventName, price, description, sellerId } = JSON.parse(event.body);
        console.log('Received request to update ticket:', { id, eventName, price, description, sellerId });

        const result = await tickets.updateOne(
            { _id: new ObjectId(id), sellerId: sellerId },
            {
                $set: {
                    eventName: eventName,
                    price: price,
                    description: description,
                    updatedAt: new Date()
                }
            }
        );
        console.log('Update operation result:', result);

        if (result.matchedCount === 1) {
            console.log('Ticket updated successfully');
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Ticket updated successfully' })
            };
        } else {
            console.log('Failed to update ticket: Unauthorized or not found');
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: 'Unauthorized to update this ticket or ticket not found' })
            };
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Error updating ticket', error: error.toString() })
        };
    }
};