const twilio = require("twilio");
const { connectToDatabase } = require('./db');

exports.handler = async function (event, context) {
    const { phoneNumber, otp } = JSON.parse(event.body);

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if the user already exists and is verified
        const existingUser = await usersCollection.findOne({ phoneNumber });

        if (existingUser && existingUser.verificationStatus === 'verified') {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, alreadyVerified: true })
            };
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        const verification_check = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: phoneNumber, code: otp });

        if (verification_check.status === 'approved') {
            // Update or insert user in the database
            await usersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        phoneNumber,
                        verificationStatus: 'verified',
                        verifiedDate: new Date()
                    }
                },
                { upsert: true }
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: verification_check.status === 'approved',
                status: verification_check.status
            })
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};