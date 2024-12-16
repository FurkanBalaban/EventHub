import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const payload = {
            eposta: email,
            sifre: password,
        };

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accesId', data.userId);
                setMessage(data.message);
                navigate('/home');

                setUserInfo({
                    userId: data.userId,
                    kullaniciAdi: data.kullanici_adi,
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Login failed');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    // Navigate to /register page
    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2>ETKİNLİK PLATFORMU</h2>
            <form onSubmit={handleLogin} className="login-form">
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
                    <label htmlFor="password">ŞİFRE:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">GİRİŞ</button>
            </form>
            {message && <p className="message">{message}</p>}
            {userInfo && (
                <div className="user-info">
                    <h3>Welcome, {userInfo.kullaniciAdi}!</h3>
                    <p>User ID: {userInfo.userId}</p>
                </div>
            )}
            {/* Redirect to register page button */}
            <button onClick={handleRegisterRedirect} className="register-button">
                HESABINIZ YOK MU ? HEMEN KAYDOLUN!
            </button>
            {/* Redirect to forgot password page button */}
<button onClick={() => navigate('/forgot-password')} className="forgot-password-button">
    ŞİFRENİZİ Mİ UNUTTUNUZ?
</button>
        </div>
    );
}

export default LoginPage;
