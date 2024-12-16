import express from 'express';
import userRoutes from './routes/userRoutes.js';  // User route'larını import ettik
import eventRoutes from './routes/EventRoutes.js';  // Event route'unu import ettik
import messageRoutes from './routes/MessageRoutes.js';  // Message route'unu import ettik
import cors from 'cors'; // CORS modülünü import ediyoruz
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());  // JSON verisi ile çalışabilmek için middleware
app.use('/api/users', userRoutes);  // Kullanıcı endpoint'leri
app.use('/api/events', eventRoutes);  // Etkinlik endpoint'leri
app.use('/api/messages', messageRoutes);  // Mesaj endpoint'leri

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
