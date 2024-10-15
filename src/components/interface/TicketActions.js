import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const TicketActions = ({ post, handleBuyTicket, handleUpdateTicket, handleDeleteTicket, userPhoneNumber }) => {
    const isOwner = post.mobileNumber === userPhoneNumber;
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({ ...post });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPost(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        handleUpdateTicket(post, updatedPost);
        setIsEditing(false);
    };

    return (
        <div className="flex space-x-2">
            {!isOwner && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="flex-1">Buy Ticket</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to buy this ticket? An SMS will be sent to the seller to initiate the transaction.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleBuyTicket(post)}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {isOwner && !isEditing && (
                <>
                    <Button className="flex-1" onClick={() => setIsEditing(true)}>Update</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex-1" variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this ticket? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTicket(post)} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
            {isOwner && isEditing && (
                <div className="w-full space-y-2">
                    <Input
                        name="event"
                        value={updatedPost.event}
                        onChange={handleInputChange}
                        placeholder="Event Name"
                    />
                    <Input
                        name="price"
                        value={updatedPost.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        type="number"
                    />
                    <Textarea
                        name="details"
                        value={updatedPost.details}
                        onChange={handleInputChange}
                        placeholder="Details"
                    />
                    <div className="flex space-x-2">
                        <Button className="flex-1" onClick={handleUpdate}>Save</Button>
                        <Button className="flex-1" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketActions;