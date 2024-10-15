const twilio = require("twilio");
const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    console.log("Function started");
    const { phoneNumber } = JSON.parse(event.body);

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ phoneNumber });

        if (existingUser && existingUser.verificationStatus === 'verified') {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, alreadyVerified: true }),
            };
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        console.log("Twilio client created");

        console.log("Attempting to create verification");
        const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({
                channel: "sms",
                to: phoneNumber,
            });

        console.log("Verification created:", verification.sid);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, sid: verification.sid }),
        };
    } catch (error) {
        console.error("Error creating verification:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};