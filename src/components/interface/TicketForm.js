import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const TicketForm = ({ newPost, handleInputChange, handlePostTicket }) => {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Post a Ticket</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Input
                        name="event"
                        value={newPost.event}
                        onChange={handleInputChange}
                        placeholder="Event Name"
                        required
                    />
                    <Input
                        name="price"
                        value={newPost.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        type="number"
                        required
                    />
                    <Textarea
                        name="details"
                        value={newPost.details}
                        onChange={handleInputChange}
                        placeholder="Additional details..."
                        required
                    />
                    <Button onClick={handlePostTicket} className="w-full">Post Ticket</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketForm;