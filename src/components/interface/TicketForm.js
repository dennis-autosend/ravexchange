import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const TicketForm = ({ newPost, handleInputChange, handlePostTicket }) => {
    const handleDateChange = (date) => {
        handleInputChange({
            target: {
                name: 'eventDate',
                value: date
            }
        });
    };

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
                    <DatePicker
                        selected={newPost.eventDate ? new Date(newPost.eventDate) : null}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select Event Date"
                        className="w-full p-2 border rounded"
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