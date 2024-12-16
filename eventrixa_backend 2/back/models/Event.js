import { execute } from '../db.js';  // db.js'den execute fonksiyonunu import ettik
import db from '../db.js';
// Etkinlik oluşturma fonksiyonu
export const createEvent = async (eventData) => {
    const { kullanici_id, ad, aciklama, tarih, sure, konum, kategori } = eventData;

    const sql = `
        INSERT INTO etkinlikler 
        (kullanici_id, ad, aciklama, tarih, sure, konum, kategori) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // execute fonksiyonunu kullanarak etkinliği kaydediyoruz
    const result = await execute(sql, [
        kullanici_id, ad, aciklama, tarih, sure, konum, kategori
    ]);

    return result;  // Kaydın sonucu
};


// Etkinlik güncelleme fonksiyonu
export const updateEvent = async (eventData) => {
    const { id, ad, aciklama, tarih, sure, konum, kategori } = eventData;

    const sql = `
        UPDATE etkinlikler
        SET ad = ?, aciklama = ?, tarih = ?, sure = ?, konum = ?, kategori = ?
        WHERE id = ?
    `;

    // execute fonksiyonunu kullanarak etkinliği güncelliyoruz
    const result = await execute(sql, [
        ad, aciklama, tarih, sure, konum, kategori, id
    ]);

    return result;  // Güncelleme sonucunu döndürüyoruz
};


// Etkinlik silme fonksiyonu
export const deleteEvent = async (eventId) => {
    const sql = `
        DELETE FROM etkinlikler
        WHERE id = ?
    `;

    // execute fonksiyonu ile etkinliği siliyoruz
    const result = await execute(sql, [eventId]);

    return result;  // Silme sonucunu döndürüyoruz
};


export const getAllEvents = async () => {
    const sql = `SELECT * FROM etkinlikler`;

    // execute fonksiyonu ile tüm etkinlikleri çekiyoruz
    const events = await execute(sql);

    return events;  // Etkinliklerin listesini döndürüyoruz
};
// Kullanıcının bir etkinliğe katılıp katılmadığını kontrol et
export const checkParticipation = async (userId, eventId) => {
    const [rows] = await db.execute(
        'SELECT * FROM event_participants WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
    );
    return rows.length > 0; // Katılım varsa true, yoksa false
};

// Kullanıcıyı etkinliğe katılmış olarak işaretle
export const addParticipation = async (userId, eventId) => {
    return db.execute(
        'INSERT INTO event_participants (user_id, event_id) VALUES (?, ?)',
        [userId, eventId]
    );
};
// Kullanıcının katıldığı etkinlikleri listeleyen fonksiyon
export const getParticipatedEvents = async (userId) => {
    const [events] = await db.execute(
        `SELECT e.id, e.ad, e.aciklama, e.tarih, e.sure, e.konum, e.kategori 
         FROM event_participants ep
         JOIN etkinlikler e ON ep.event_id = e.id 
         WHERE ep.user_id = ?`,
        [userId]
    );
    return events;
};