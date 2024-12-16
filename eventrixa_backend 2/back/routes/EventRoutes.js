import express from 'express';
import { createEvent, updateEvent, deleteEvent, getAllEvents } from '../models/Event.js';
import { checkParticipation, addParticipation } from '../models/Event.js';
import { getParticipatedEvents } from '../models/Event.js'; // Model fonksiyonlarını dahil edin

const router = express.Router();

// Etkinlik oluşturma
router.post('/create', async (req, res) => {
    try {
        const eventData = req.body;
        const result = await createEvent(eventData);
        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
});

// Etkinlik güncelleme
router.put('/update', async (req, res) => {
    try {
        const eventData = req.body;  // Body'den gelen etkinlik verisi
        const result = await updateEvent(eventData);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Event updated successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
});

// Etkinlik silme
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;  // Body'den etkinlik ID'si alınıyor

        const result = await deleteEvent(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
});

// Kullanıcının etkinliğe katılımını kontrol et ve ekle
router.post('/joinEvent', async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        // Katılım durumunu kontrol et
        const isParticipated = await checkParticipation(userId, eventId);
        if (isParticipated) {
            return res.status(400).json({ message: 'You have already joined this event.' });
        }

        // Katılım ekle
        await addParticipation(userId, eventId);
        res.status(200).json({ message: 'Successfully joined the event.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
});


router.get('/:userId/participatedEvents', async (req, res) => {
    const { userId } = req.params;

    try {
        const events = await getParticipatedEvents(userId); // Model fonksiyonunu çağır
        res.status(200).json(events); // Etkinlikleri döndür
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
});



router.get('/all', async (req, res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

export default router;
