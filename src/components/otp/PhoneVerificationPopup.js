import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from '../ui/input';

export const formatPhoneNumber = (str) => {
    try {
        const phoneNumber = parsePhoneNumber(str);
        return phoneNumber.formatInternational();
    } catch (error) {
        return str;
    }
};

const PhoneVerificationPopup = ({ isOpen, onClose, onVerify }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {
        try {
            if (!isValidPhoneNumber(phoneNumber)) {
                alert('Please enter a valid phone number');
                return;
            }

            const parsedNumber = parsePhoneNumber(phoneNumber);
            const e164PhoneNumber = parsedNumber.format('E.164');

            const response = await fetch('/.netlify/functions/create-verification', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber: e164PhoneNumber }),
            });
            const data = await response.json();
            if (data.success) {
                if (data.alreadyVerified) {
                    alert('This phone number is already verified.');
                    onVerify(phoneNumber);
                    onClose();
                } else {
                    setOtpSent(true);
                }
            } else {
                alert(`Failed to send OTP. Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert(`An error occurred. Please try again. Error: ${error.message}`);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const parsedNumber = parsePhoneNumber(phoneNumber);
            const e164PhoneNumber = parsedNumber.format('E.164');

            const response = await fetch('/.netlify/functions/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber: e164PhoneNumber, otp }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert('OTP verified successfully!');
                onVerify(phoneNumber);
                onClose();
            } else {
                alert(`Failed to verify OTP. Status: ${data.status}`);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert(`An error occurred. Please try again. Error: ${error.message}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify Your Phone Number</DialogTitle>
                    <DialogDescription>
                        Enter your phone number to receive a one-time password (OTP).
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {!otpSent ? (
                        <>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                placeholder="Phone Number"
                                type="tel"
                            />
                            <Button onClick={handleSendOtp} className="w-full">Send OTP</Button>
                        </>
                    ) : (
                        <>
                            <Input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                type="text"
                            />
                            <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PhoneVerificationPopup;