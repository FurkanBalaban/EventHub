import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
    // State hooks for form inputs and message
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [kullaniciAdi, setKullaniciAdi] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [konum, setKonum] = useState('');
    const [ilgiAlani, setIlgiAlani] = useState('');
    const [telefonNo, setTelefonNo] = useState('');
    const [cinsiyet, setCinsiyet] = useState('Erkek');
    const [profilFotoUrl, setProfilFotoUrl] = useState('');
    const [message, setMessage] = useState('');
    const [secretAnswer, setSecretAnswer] = useState('');

    const navigate = useNavigate();

    // Handle the registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        const payload = {
            ad,
            soyad,
            kullanici_adi: kullaniciAdi,
            eposta: email,
            sifre,
            konum,
            ilgi_alanlari: ilgiAlani,
            telefon_no: telefonNo,
            cinsiyet,
            secret_answer: secretAnswer,
            profil_foto_url: profilFotoUrl,
        };

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || 'Registration successful');
                navigate('/');  // Redirect to home (or root route) after successful registration
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Registration failed');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                    <label htmlFor="ad">First Name:</label>
                    <input
                        type="text"
                        id="ad"
                        value={ad}
                        onChange={(e) => setAd(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="soyad">Last Name:</label>
                    <input
                        type="text"
                        id="soyad"
                        value={soyad}
                        onChange={(e) => setSoyad(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="kullaniciAdi">Username:</label>
                    <input
                        type="text"
                        id="kullaniciAdi"
                        value={kullaniciAdi}
                        onChange={(e) => setKullaniciAdi(e.target.value)}
                        required
                    />
                </div>
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
                    <label htmlFor="sifre">Password:</label>
                    <input
                        type="password"
                        id="sifre"
                        value={sifre}
                        onChange={(e) => setSifre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="konum">Location:</label>
                    <input
                        type="text"
                        id="konum"
                        value={konum}
                        onChange={(e) => setKonum(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ilgiAlani">Interests:</label>
                    <input
                        type="text"
                        id="ilgiAlani"
                        value={ilgiAlani}
                        onChange={(e) => setIlgiAlani(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefonNo">Phone Number:</label>
                    <input
                        type="text"
                        id="telefonNo"
                        value={telefonNo}
                        onChange={(e) => setTelefonNo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cinsiyet">Gender:</label>
                    <select
                        id="cinsiyet"
                        value={cinsiyet}
                        onChange={(e) => setCinsiyet(e.target.value)}
                    >
                        <option value="Erkek">Male</option>
                        <option value="Kadın">Female</option>
                    </select>
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
                    <label htmlFor="profilFotoUrl">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilFotoUrl"
                        value={profilFotoUrl}
                        onChange={(e) => setProfilFotoUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default RegisterPage;
