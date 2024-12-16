import React, { useEffect, useState } from 'react';
import Navbar from '../comps/navbar/Navbar';
import './HomePage.css';

function HomePage() {
    const [events, setEvents] = useState([]);  // Etkinliklerin listesi
    const [loading, setLoading] = useState(true);  // Yüklenme durumu
    const [error, setError] = useState('');  // Hata mesajı
    const [messagesMap, setMessagesMap] = useState({});  // Etkinlik ID'sine göre mesajlar
    const [editingEvent, setEditingEvent] = useState(null); // Düzenlenen etkinlik
    const [updatedEvent, setUpdatedEvent] = useState({});   // Güncellenmiş etkinlik verisi

    // Mesajları getir
    const fetchMessagesForEvent = async (eventId) => {
        try {
            // Etkinlik için mesajları alıyoruz
            const response = await fetch('http://localhost:3000/api/messages/get-messages-by-event-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etkinlik_id: eventId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            const messages = data.messages;

            // Her bir mesaj için kullanıcı bilgilerini almak
            const messagesWithUserInfo = await Promise.all(messages.map(async (message) => {
                const userResponse = await fetch('http://localhost:3000/api/users/getUserInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: message.kullanici_id }),  // Kullanıcı ID'sini gönderiyoruz
                });

                if (!userResponse.ok) {
                    throw new Error(`Error fetching user info: ${userResponse.status}`);
                }

                const userData = await userResponse.json();
                const userName = `${userData.ad} ${userData.soyad}`;  // Kullanıcı adını ve soyadını birleştiriyoruz

                // Mesajı kullanıcı bilgileri ile birleştiriyoruz
                return {
                    ...message,
                    userName: userName,  // Kullanıcı adını mesaja ekliyoruz
                    userProfileImage: userData.profil_foto_url,  // Kullanıcı profil fotoğrafını da ekleyebiliriz
                };
            }));

            return messagesWithUserInfo;  // Kullanıcı bilgilerini içeren mesajları döndürüyoruz

        } catch (err) {
            console.error('Error fetching messages:', err);
            return [];  // Mesajlar çekilemezse boş dizi döndürüyoruz
        }
    };
// Etkinlik güncelleme formunu açma
const handleEdit = (event) => {
    setEditingEvent(event);
    setUpdatedEvent(event);
};
// Etkinlik verisini güncelleme
const handleUpdateChange = (field, value) => {
    setUpdatedEvent((prev) => ({
        ...prev,
        [field]: value,
    }));
};
// API'ye güncelleme isteği gönderme
const updateEvent = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/events/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            setEditingEvent(null);
            // Etkinlikleri yeniden yükleme
            fetchEvents();
        } else {
            console.error('Error updating event');
        }
    } catch (error) {
        console.error('Error updating event:', error);
    }
};

    // Mesaj gönder
    const sendMessage = async (eventId) => {
        const userId = localStorage.getItem('accesId');  // Kullanıcı ID'sini localStorage'dan al
        if (!userId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        const newMessage = messagesMap[eventId]; // O etkinliğe özgü mesaj
        if (!newMessage || !newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/api/messages/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    kullanici_id: userId,
                    etkinlik_id: eventId,
                    icerik: newMessage,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error sending message: ${response.status}`);
            }

            setMessagesMap((prevState) => ({
                ...prevState,
                [eventId]: '', // Mesaj gönderildikten sonra inputu temizle
            }));

            fetchEvents();  // Etkinlikleri ve mesajları yeniden yükle
        } catch (err) {
            console.error('Error sending message:', err);
            setError('An error occurred while sending your message.');
        }
    };
    const handleJoinEvent = async (eventId) => {
        const userId = localStorage.getItem('accesId'); // Kullanıcı ID'sini al
    
        try {
            const response = await fetch(`http://localhost:3000/api/events/joinEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, eventId }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert('Etkinliğe başarıyla katıldınız!');
            } else {
                alert(result.message || 'Etkinliğe katılamadınız.');
            }
        } catch (error) {
            console.error('Error joining event:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };
    

    // API'den etkinlikleri getir
    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:3000/api/events/all');
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            // Her etkinlik için mesajları fetch et
            const eventsWithMessages = await Promise.all(
                data.map(async (event) => {
                    const messages = await fetchMessagesForEvent(event.id);
                    return { ...event, messages };  // Mesajları etkinlik ile birleştir
                })
            );

            setEvents(eventsWithMessages);
            // İlk başta, her etkinlik için bir mesaj durumu başlatıyoruz
            const initialMessagesMap = eventsWithMessages.reduce((acc, event) => {
                acc[event.id] = '';  // Her etkinlik için başlangıçta boş mesaj
                return acc;
            }, {});
            setMessagesMap(initialMessagesMap);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('An error occurred while fetching events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    const handleDelete = async (eventId) => {
        try {
            const response = await fetch('http://localhost:3000/api/events/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: eventId }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                // Etkinlik listesini yeniden yükle
                fetchEvents(); // events'i yeniden çekmek için fonksiyon
            } else {
                alert(data.message || 'Error deleting event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete the event.');
        }
    };
    
    // Mesaj input'unu her etkinlik için güncelle
    const handleMessageChange = (eventId, value) => {
        setMessagesMap((prevState) => ({
            ...prevState,
            [eventId]: value, // O etkinliğe özgü mesajı güncelle
        }));
    };

    return (
        <div className="home-container">
            <Navbar />
            <h1>ETKİNLİKLER</h1>
    
            {/* Yükleme mesajı */}
            {loading && <p className="loading">Etkinlikler Yükleniyor...</p>}
    
            {/* Hata mesajı */}
            {error && <p className="error">{error}</p>}
    
            {/* Etkinlikler listesi */}
            {!loading && !error && (
                <div className="events-grid">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div className="event-card" key={event.id} style={{ textAlign: 'start' }}>
                                <h2>{event.ad}</h2>
                                <p><strong>AÇIKLAMA:</strong> {event.aciklama}</p>
                                <p><strong>TARİH:</strong> {new Date(event.tarih).toLocaleString()}</p>
                                <p><strong>SÜRESİ:</strong> {event.sure} hours</p>
                                <p><strong>KONUM:</strong> {event.konum}</p>
                                <p><strong>KATEGORİ:</strong> {event.kategori}</p>
    
                                {/* Silme butonu */}
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(event.id)}
                                >
                                    SİL
                                </button>
                                <button onClick={() => handleEdit(event)}>GÜNCELLE</button>
                                {editingEvent && editingEvent.id === event.id && (
    <div className="update-form">
        <h3>Update Event</h3>
        <label>
            Name:
            <input
                type="text"
                value={updatedEvent.ad || ''}
                onChange={(e) => handleUpdateChange('ad', e.target.value)}
            />
        </label>
        <label>
            Description:
            <textarea
                value={updatedEvent.aciklama || ''}
                onChange={(e) => handleUpdateChange('aciklama', e.target.value)}
            />
        </label>
        <label>
            Date:
            <input
                type="datetime-local"
                value={updatedEvent.tarih || ''}
                onChange={(e) => handleUpdateChange('tarih', e.target.value)}
            />
        </label>
        <label>
            Duration:
            <input
                type="number"
                value={updatedEvent.sure || ''}
                onChange={(e) => handleUpdateChange('sure', e.target.value)}
            />
        </label>
        <label>
            Location:
            <input
                type="text"
                value={updatedEvent.konum || ''}
                onChange={(e) => handleUpdateChange('konum', e.target.value)}
            />
        </label>
        <label>
            Category:
            <input
                type="text"
                value={updatedEvent.kategori || ''}
                onChange={(e) => handleUpdateChange('kategori', e.target.value)}
            />
        </label>
        <button onClick={updateEvent}>Save</button>
        <button onClick={() => setEditingEvent(null)}>Cancel</button>
    </div>
)}
     {/* Katıldım Butonu */}
     <button
                className="join-button"
                onClick={() => handleJoinEvent(event.id)} // Katılım fonksiyonunu tetikleme
            >
                Katıldım
            </button>
                                {/* Mesajlar kısmı */}
                                {event.messages && event.messages.length > 0 ? (
                                    <div className="event-messages">
                                        <h3>MESAJLAR:</h3>
                                        <ul>
                                            {event.messages.map((message, index) => (
                                                <li key={index}>
                                                    <div className="message-header">
                                                        {message.userProfileImage && (
                                                            <img
                                                                src={message.userProfileImage}
                                                                alt={message.userName}
                                                                className="profile-image"
                                                            />
                                                        )}
                                                        <strong>{message.userName}</strong> - {new Date(message.tarih).toLocaleString()}
                                                    </div>
                                                    <p>{message.icerik}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p>No messages for this event.</p>
                                )}
    
                                {/* Mesaj gönderme alanı */}
                                <div className="message-input">
                                    <textarea
                                        value={messagesMap[event.id] || ''}
                                        onChange={(e) => handleMessageChange(event.id, e.target.value)}
                                        placeholder="Mesaj yazınız..."
                                    />
                                    <button onClick={() => sendMessage(event.id)}>MESAJI GÖNDER</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            )}
        </div>
    );
    
}

export default HomePage;
