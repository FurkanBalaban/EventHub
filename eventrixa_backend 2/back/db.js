// db.js
import mysql from 'mysql2/promise';

// Veritabanı bağlantısını oluşturuyoruz
const pool = mysql.createPool({
    host: 'localhost',   // Veritabanı host adresi
    user: 'root',        // Veritabanı kullanıcı adı
    password: '12345678',     // Veritabanı şifresi
    database: 'yazlab2_2' // Veritabanı adı
});

// execute fonksiyonu, veritabanı sorgularını çalıştırmak için kullanılacak
export const execute = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);  // Dönen değeri doğrudan alıyoruz
    console.log("Rows:", rows); // Burada rows verisini kontrol ediyoruz
    console.log("Is Rows an Array?", Array.isArray(rows)); // rows'un bir dizi (array) olup olmadığını kontrol ediyoruz
    return rows;  // sadece rows'u döndürüyoruz
};


export default pool;
