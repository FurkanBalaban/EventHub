import express from 'express';
import { create, login, updateUser, deleteUser, getUserInformationById } from '../models/User.js';
import { updateUserPassword } from '../models/User.js';
import { getUserByEmail} from '../models/User.js';
const router = express.Router();

// Kullanıcı kaydı (register)
router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        const result = await create(userData);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Kullanıcı girişi (login)
router.post('/login', async (req, res) => {
    try {
        const { eposta, sifre } = req.body;
        const user = await login(eposta, sifre);
        res.status(200).json({
            message: 'Login successful',
            userId: user.id,
            kullanici_adi: user.kullanici_adi
        });
    } catch (error) {
        console.error('Error details:', error);  // Detaylı hata loglaması
        res.status(400).json({
            message: 'Login failed',
            error: error.message,
            stack: error.stack  // Stack trace ekleyerek daha fazla bilgi verelim
        });
    }
});




// Kullanıcı bilgilerini güncelleme
router.put('/update', async (req, res) => {
    try {
        const userData = req.body;  // Body'den gelen kullanıcı verisi
        const result = await updateUser(userData);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Kullanıcı silme
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;  // Body'den kullanıcı ID'si alınıyor

        const result = await deleteUser(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

router.post('/getUserInfo', async (req, res) => {
    try {
        const userId = req.body.id;
        console.log('User ID:', userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await getUserInformationById(userId);
        console.log("User from DB:", user); // Burada gelen veriyi kontrol ediyoruz

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user); // Kullanıcıyı başarılı bir şekilde döndürüyoruz
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const { eposta, gizliCevap, yeniParola } = req.body;

        console.log('Received email:', eposta);
        console.log('Received secret answer:', gizliCevap);

        if (!eposta || !gizliCevap || !yeniParola) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await getUserByEmail(eposta);

        if (!user) {
            console.error('User not found for email:', eposta);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        if (user.secret_answer !== gizliCevap) {
            console.error('Incorrect secret answer for user:', user);
            return res.status(400).json({ message: 'Incorrect secret answer' });
        }

        const result = await updateUserPassword(user.id, yeniParola);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Password reset successfully' });
        } else {
            res.status(500).json({ message: 'Failed to reset password' });
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});




export default router;
