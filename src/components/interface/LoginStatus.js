import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

const LoginStatus = ({ isLoggedIn, userPhoneNumber, onLoginClick }) => {
    return isLoggedIn ? (
        <p className="text-green-600 mb-4 flex items-center justify-center">
            <CheckCircle2 className="mr-2" /> Logged in with {userPhoneNumber}
        </p>
    ) : (
        <Button onClick={onLoginClick} className="w-full mb-4">
            Login with Phone Number
        </Button>
    );
};

export default LoginStatus;