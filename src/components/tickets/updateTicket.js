export const updateTicket = async (post, updatedData, userPhoneNumber, setPosts) => {
    try {
        const response = await fetch('/.netlify/functions/update-ticket', {
            method: 'POST',
            body: JSON.stringify({
                id: post.id,
                eventName: updatedData.event,
                price: updatedData.price,
                description: updatedData.details,
                sellerId: userPhoneNumber
            }),
        });

        const data = await response.json();

        if (data.success) {
            setPosts(prevPosts => prevPosts.map(ticket =>
                ticket.id === post.id ? { ...ticket, ...updatedData } : ticket
            ));
            alert('Ticket updated successfully!');
            return true;
        } else {
            alert(`Failed to update ticket. Error: ${data.message}`);
            return false;
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
        alert('An error occurred while updating the ticket. Please try again.');
        return false;
    }
};