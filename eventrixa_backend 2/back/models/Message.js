import { execute } from '../db.js';  // db.js'den execute fonksiyonunu import ettik

// Mesaj oluşturma fonksiyonu
export const createMessage = async (messageData) => {
    const { kullanici_id, etkinlik_id, icerik } = messageData;

    const sql = `
        INSERT INTO mesajlar 
        (kullanici_id, etkinlik_id, icerik) 
        VALUES (?, ?, ?)
    `;

    const result = await execute(sql, [kullanici_id, etkinlik_id, icerik]);

    return result;  // Kaydın sonucu
};
export const getMessagesByEvent = async (etkinlik_id) => {
    const sql = `
        SELECT * FROM mesajlar 
        WHERE etkinlik_id = ?
    `;
    const result = await execute(sql, [etkinlik_id]);
    return result; // Mesajları döndür
};

// Kullanıcı ID'sine göre mesajları getiren fonksiyon
export const getMessagesByUser = async (kullanici_id) => {
    const sql = `
        SELECT * FROM mesajlar 
        WHERE kullanici_id = ?
    `;
    const result = await execute(sql, [kullanici_id]);
    return result; // Mesajları döndür
};
