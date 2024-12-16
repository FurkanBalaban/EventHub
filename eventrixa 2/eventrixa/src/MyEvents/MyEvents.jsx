import React, { useEffect, useState } from 'react';
import './MyEvents.css';

function MyEvents() {
    const [events, setEvents] = useState([]); // Etkinlikleri tutmak için state
    const userId = localStorage.getItem('accesId'); // LocalStorage'dan kullanıcı ID'sini al

    useEffect(() => {
        // Katıldığı etkinlikleri çek
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/events/${userId}/participatedEvents`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data); // Gelen etkinlikleri state'e ata
                } else {
                    console.error('Failed to fetch events');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [userId]);

    return (
        <div className="my-events-container">
            <h2>ETKİNLİKLERİM</h2>
            {events.length > 0 ? (
                <div className="events-list">
                    {events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3>{event.ad}</h3>
                            <p><strong>AÇIKLAMA:</strong> {event.aciklama}</p>
                            <p><strong>TARİH:</strong> {new Date(event.tarih).toLocaleString()}</p>
                            <p><strong>SÜRESİ:</strong> {event.sure} saat</p>
                            <p><strong>KONUM:</strong> {event.konum}</p>
                            <p><strong>KATEGORİ:</strong> {event.kategori}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>HERHANGİ BİR ETKİNLİĞE KATILIM SAĞLAMADINIZ.</p>
            )}
        </div>
    );
}

export default MyEvents;
