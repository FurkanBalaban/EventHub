import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [secretAnswer, setSecretAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const payload = {
            eposta: email,
            gizliCevap: secretAnswer,
            yeniParola: newPassword,
        };

        try {
            const response = await fetch('http://localhost:3000/api/users/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/'); // Login sayfasına yönlendirme
                }, 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Password reset failed');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleResetPassword} className="forgot-password-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="secretAnswer">Secret Answer:</label>
                    <input
                        type="text"
                        id="secretAnswer"
                        value={secretAnswer}
                        onChange={(e) => setSecretAnswer(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default ForgotPassword;
