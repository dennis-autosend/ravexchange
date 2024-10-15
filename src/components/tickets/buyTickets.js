export const handleBuyTicket = async (post, isLoggedIn, setIsVerificationOpen, userPhoneNumber) => {
    if (!isLoggedIn) {
        setIsVerificationOpen(true);
        return;
    }
    try {
        const response = await fetch('/.netlify/functions/send-sms2seller', {
            method: 'POST',
            body: JSON.stringify({
                to: post.mobileNumber,
                message: `A buyer is interested in your ticket for ${post.event}. Please contact them at ${userPhoneNumber}.`
            }),
        });
        const data = await response.json();
        if (data.success) {
            alert(`SMS sent to seller at ${post.mobileNumber}. Seller will contact you to complete the purchase.`);
        } else {
            alert(`Failed to send SMS. Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        alert('An error occurred while sending SMS. Please try again.');
    }
};