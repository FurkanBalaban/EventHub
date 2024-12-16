import { execute } from '../db.js';  // Veritabanı bağlantısını import ettik
import bcrypt from 'bcrypt';  // Bcrypt ile şifreleme yapacağız

// Kullanıcı oluşturma (register)
export const create = async (userData) => {
    const { ad, soyad, kullanici_adi, eposta, sifre, konum, ilgi_alanlari, telefon_no, cinsiyet, profil_foto_url } = userData;

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(sifre, 10);

    const sql = `
        INSERT INTO kullanicilar 
        (ad, soyad, kullanici_adi, eposta, sifre, konum, ilgi_alanlari, telefon_no, cinsiyet, profil_foto_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // execute fonksiyonunu kullanarak sorguyu çalıştırıyoruz
    const result = await execute(sql, [
        ad, soyad, kullanici_adi, eposta, hashedPassword, konum, ilgi_alanlari, telefon_no, cinsiyet, profil_foto_url
    ]);

    return result; // Burada dönen sonucu olduğu gibi geri döndürüyoruz.
};


export const login = async (eposta, sifre) => {
    const sql = 'SELECT * FROM kullanicilar WHERE eposta = ?';
    const [rows] = await execute(sql, [eposta]);

    console.log('Rows from DB:', rows);  // Burada gelen tüm satırları kontrol et

    // Eğer rows boş veya undefined ise, kullanıcı bulunamadı hatası veriyoruz
    if (!rows || rows.length === 0) {
        throw new Error('User not found');
    }

    // rows[0] olup olmadığını kontrol et
    const user = rows;

    // user'ı kontrol et ve logla
    if (!user) {
        console.log('User is undefined or null');
        throw new Error('User data is invalid');
    }

    console.log('User from DB:', user);  // Kullanıcıyı kontrol et

    // Kullanıcının şifresini doğrula
    if (!user.sifre) {
        throw new Error('Password not found for the user');
    }

    const isPasswordValid = await bcrypt.compare(sifre, user.sifre);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    return user;
};





// Kullanıcı bilgilerini güncelleme fonksiyonu
// Kullanıcı bilgilerini güncelleme fonksiyonu (Şifre hariç)
export const updateUser = async (userData) => {
    const { id, ad, soyad, kullanici_adi, eposta, konum, ilgi_alanlari, telefon_no, cinsiyet, profil_foto_url } = userData;

    const sql = `
        UPDATE kullanicilar 
        SET 
            ad = ?, 
            soyad = ?, 
            kullanici_adi = ?, 
            eposta = ?, 
            konum = ?, 
            ilgi_alanlari = ?, 
            telefon_no = ?, 
            cinsiyet = ?, 
            profil_foto_url = ?
        WHERE id = ?
    `;

    // execute fonksiyonu ile veritabanını güncelliyoruz
    const result = await execute(sql, [
        ad, soyad, kullanici_adi, eposta, konum, ilgi_alanlari, telefon_no, cinsiyet, profil_foto_url, id
    ]);

    return result;  // Güncelleme sonucunu döndürüyoruz
};



// Kullanıcıyı silme fonksiyonu
export const deleteUser = async (userId) => {
    const sql = `
        DELETE FROM kullanicilar 
        WHERE id = ?
    `;

    // execute fonksiyonu ile kullanıcıyı siliyoruz
    const result = await execute(sql, [userId]);

    return result;  // Silme sonucunu döndürüyoruz
};


// Kullanıcı bilgilerini ID'ye göre getirme fonksiyonu
// Kullanıcı bilgilerini ID'ye göre getirme fonksiyonu
export const getUserInformationById = async (id) => {
    const sql = 'SELECT * FROM kullanicilar WHERE id = ?';
    const rows = await execute(sql, [id]);

    console.log("Rows received from DB:", rows); // rows verisini burada kontrol ediyoruz

    // rows bir dizi (array) değilse, hata mesajı gösterelim
    if (!Array.isArray(rows)) {
        console.error("Veritabanından gelen sonuçlar bir dizi (array) olmalı.");
        return null;
    }

    console.log("Rows Length:", rows.length); // length'i kontrol et
    if (rows.length === 0) {
        return null;  // Eğer kullanıcı yoksa, null döndür
    }

    console.log("Returning user:", rows[0]); // Veritabanından gelen kullanıcı verisini burada gösteriyoruz
    return rows[0];  // Kullanıcıyı döndürüyoruz
};
// Kullanıcıyı e-posta ile getirme fonksiyonu

export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM kullanicilar WHERE LOWER(eposta) = LOWER(?)';
    const result = await execute(query, [email.trim()]); // Gelen sonucu kontrol edelim

    console.log('Result from execute:', result); // Tüm sonuçları loglayın

    const rows = Array.isArray(result) ? result : result[0]; // Eğer obje ise düzelt

    console.log('Rows processed:', rows); // İşlenmiş rows çıktısını loglayın

    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0]; // İlk kullanıcıyı döndür
    } else {
        console.error('Rows is not an array or it is empty');
        return null;
    }
};



// Kullanıcının şifresini güncelleme fonksiyonu
export const updateUserPassword = async (id, yeniParola) => {
    const hashedPassword = await bcrypt.hash(yeniParola, 10);

    const sql = `
        UPDATE kullanicilar 
        SET sifre = ? 
        WHERE id = ?
    `;

    const result = await execute(sql, [hashedPassword, id]);

    return result;
};




