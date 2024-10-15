export const deleteTicket = async (post, userPhoneNumber, setPosts) => {
    try {
        console.log('Sending delete request for ticket:', post.id);
        const response = await fetch('/.netlify/functions/delete-ticket', {
            method: 'POST',
            body: JSON.stringify({
                id: post.id,
                userPhoneNumber: userPhoneNumber
            }),
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (data.success) {
            setPosts(prevPosts => prevPosts.filter(ticket => ticket.id !== post.id));
            alert('Ticket deleted successfully!');
        } else {
            console.error('Failed to delete ticket:', data.message);
            alert(`Failed to delete ticket. Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('An error occurred while deleting the ticket. Please try again.');
    }
};