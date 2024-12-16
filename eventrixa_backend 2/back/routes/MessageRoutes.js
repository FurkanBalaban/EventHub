import express from 'express';
import { createMessage, getMessagesByEvent, getMessagesByUser } from '../models/Message.js';

const router = express.Router();

// Mesaj oluşturma (create message)
router.post('/create', async (req, res) => {
    try {
        const { kullanici_id, etkinlik_id, icerik } = req.body;

        // Mesaj verilerini model fonksiyonuna gönderiyoruz
        const result = await createMessage({ kullanici_id, etkinlik_id, icerik });

        res.status(201).json({
            message: 'Message created successfully',
            messageId: result.insertId // Mesaj ID'sini geri gönderiyoruz
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating message',
            error: error.message
        });
    }
});

// Etkinlik ID'sine göre mesajları getirme (body'den alıyoruz)
router.post('/get-messages-by-event-id', async (req, res) => {
    try {
        const { etkinlik_id } = req.body; // Body'den etkinlik_id alıyoruz

        // Etkinlik ID'sine göre mesajları alıyoruz
        const messages = await getMessagesByEvent(etkinlik_id);

        res.status(200).json({
            message: 'Messages retrieved successfully',
            messages: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving messages',
            error: error.message
        });
    }
});

// Kullanıcı ID'sine göre mesajları getirme (body'den alıyoruz)
router.post('/get-messages-by-user-id', async (req, res) => {
    try {
        const { kullanici_id } = req.body; // Body'den kullanıcı_id alıyoruz

        // Kullanıcı ID'sine göre mesajları alıyoruz
        const messages = await getMessagesByUser(kullanici_id);

        res.status(200).json({
            message: 'Messages retrieved successfully',
            messages: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving messages',
            error: error.message
        });
    }
});

export default router;
