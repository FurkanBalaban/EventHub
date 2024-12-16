// src/components/Navbar.jsx
import React, { useState } from 'react';

import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
    const navigate = useNavigate();

    // Popup'ı açmak için
    const openCreateEventPopup = () => {
        setShowCreateEventPopup(true);
    };

    // Popup'ı kapatmak için
    const closeCreateEventPopup = () => {
        setShowCreateEventPopup(false);
    };

    const handleLogout = () => {
        navigate('/');
    }


    return (
        <nav className="navbar">
            <a href="#etkinlik-olustur" onClick={openCreateEventPopup}>Etkinlik Oluştur</a>
            <a href="#etkinliklerim" onClick={() => navigate('/my-events')}>
    Etkinliklerim
</a>
            <a href="/hesabim">Hesabım</a>
            <a href="#cikis" onClick={handleLogout}>Çıkış Yap</a>


            {showCreateEventPopup && <CreateEventPopup closePopup={closeCreateEventPopup} />}
        </nav>
    );
}

// Etkinlik oluşturma popup'ı bileşeni
function CreateEventPopup({ closePopup }) {
    const [eventDetails, setEventDetails] = useState({
        ad: '',
        aciklama: '',
        tarih: '',
        sure: '',
        konum: '',
        kategori: '',
    });

    // localStorage'dan kullanıcı ID'sini almak
    const userId = localStorage.getItem('accesId'); // accesId'yi alıyoruz

    // Form verilerini güncelleyen fonksiyon
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails({ ...eventDetails, [name]: value });
    };

    // Etkinlik oluşturma işlemi
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const newEvent = {
            kullanici_id: userId,
            ad: eventDetails.ad,
            aciklama: eventDetails.aciklama,
            tarih: eventDetails.tarih,
            sure: parseFloat(eventDetails.sure),
            konum: eventDetails.konum,
            kategori: eventDetails.kategori,
        };

        try {
            const response = await fetch('http://localhost:3000/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            const result = await response.json();

            if (result.message === 'Event created successfully') {
                alert('Etkinlik başarıyla oluşturuldu!');
                closePopup(); // Popup'ı kapatıyoruz
            } else {
                alert('Etkinlik oluşturulamadı. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Etkinlik Oluştur</h2>
                <form onSubmit={handleCreateEvent}>
                    <label>
                        Etkinlik Adı:
                        <input
                            type="text"
                            name="ad"
                            value={eventDetails.ad}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Açıklama:
                        <textarea
                            name="aciklama"
                            value={eventDetails.aciklama}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Tarih (YYYY-MM-DD HH:mm:ss):
                        <input
                            type="text"
                            name="tarih"
                            value={eventDetails.tarih}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Süre (saat cinsinden):
                        <input
                            type="number"
                            name="sure"
                            value={eventDetails.sure}
                            onChange={handleInputChange}
                            step="0.1"
                            required
                        />
                    </label>
                    <label>
                        Konum:
                        <input
                            type="text"
                            name="konum"
                            value={eventDetails.konum}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Kategori:
                        <input
                            type="text"
                            name="kategori"
                            value={eventDetails.kategori}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">Oluştur</button>
                    <button type="button" onClick={closePopup}>İptal</button>
                </form>
            </div>
        </div>
    );
}

export default Navbar;
