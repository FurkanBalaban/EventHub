-- Veritabanı oluşturma
CREATE DATABASE yazlab2_2;
USE yazlab2_2;

-- Kullanıcılar tablosu
CREATE TABLE kullanicilar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    kullanici_adi VARCHAR(50) UNIQUE NOT NULL,
    eposta VARCHAR(100) UNIQUE NOT NULL,
    sifre VARCHAR(255) NOT NULL,
    konum VARCHAR(100),
    ilgi_alanlari TEXT,
    telefon_no VARCHAR(15),
    cinsiyet ENUM('Erkek', 'Kadın', 'Diğer'),
    profil_foto_url TEXT
);

-- Etkinlikler tablosu
CREATE TABLE etkinlikler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    tarih DATETIME NOT NULL,
    sure FLOAT NOT NULL,
    konum VARCHAR(100) NOT NULL,
    kategori VARCHAR(50),
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
);

-- Mesajlar tablosu
CREATE TABLE mesajlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    etkinlik_id INT NOT NULL,
    icerik TEXT NOT NULL,
    tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    FOREIGN KEY (etkinlik_id) REFERENCES etkinlikler(id) ON DELETE CASCADE
);

-- Puanlar tablosu
CREATE TABLE puanlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    puan INT NOT NULL,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
);
-- katılım tablosu
CREATE TABLE event_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id), -- Aynı kullanıcı bir etkinliğe sadece bir kez katılabilir
    FOREIGN KEY (user_id) REFERENCES kullanicilar(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
