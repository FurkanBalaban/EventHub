import React, { useState, useEffect } from 'react';
import Navbar from '../comps/navbar/Navbar';
import './MyAccount.css';

function MyAccount() {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        kullanici_adi: '',
        eposta: '',
        konum: '',
        ilgi_alanlari: '',
        telefon_no: '',
        cinsiyet: '',
        profil_foto_url: ''
    });

    useEffect(() => {
        const accessId = localStorage.getItem('accesId');
        if (!accessId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        fetch(`http://localhost:3000/api/users/getUserInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: accessId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Received user data:', data);  // Debugging line
                if (data && data.id) {
                    setUserInfo(data);
                    setFormData({
                        ad: data.ad,
                        soyad: data.soyad,
                        kullanici_adi: data.kullanici_adi,
                        eposta: data.eposta,
                        konum: data.konum,
                        ilgi_alanlari: data.ilgi_alanlari,
                        telefon_no: data.telefon_no,
                        cinsiyet: data.cinsiyet,
                        profil_foto_url: data.profil_foto_url
                    });
                } else {
                    console.error('Received invalid user data:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const accessId = localStorage.getItem('accesId');
        if (!accessId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        fetch(`http://localhost:3000/api/users/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: accessId,
                ...formData
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Successfully updated user data:', data);
                if (data && data.id) {
                    setUserInfo(data);  // Update user info after successful update
                    setIsEditing(false);  // Switch back to view mode
                } else {
                    console.error('Failed to update user data:', data);
                }
            })
            .catch((error) => {
                console.error('Error updating user info:', error);
            });
    };
    const handleDelete = () => {
        const accessId = localStorage.getItem('accesId');
        if (!accessId) {
            console.error('User ID not found in localStorage.');
            return;
        }
    
        // Kullanıcı silme API çağrısı
        fetch(`http://localhost:3000/api/users/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: accessId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('User deletion response:', data);
                if (data.message === 'User deleted successfully') {
                    alert('Kullanıcı başarıyla silindi.'); // Kullanıcıya bildirim
                    localStorage.removeItem('accesId'); // Kullanıcı oturumunu temizle
                    window.location.href = '/'; // Ana sayfaya yönlendir
                } else {
                    console.error('Failed to delete user:', data);
                }
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };
    
    return (
        <div className="my-account">
            <Navbar />
            {userInfo ? (
                <div>
                    <img src={userInfo.profil_foto_url} alt="Profile" />
                    <h2>{userInfo.kullanici_adi}</h2>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Ad:</label>
                                <input
                                    type="text"
                                    name="ad"
                                    value={formData.ad}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Soyad:</label>
                                <input
                                    type="text"
                                    name="soyad"
                                    value={formData.soyad}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Kullanıcı Adı:</label>
                                <input
                                    type="text"
                                    name="kullanici_adi"
                                    value={formData.kullanici_adi}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="eposta"
                                    value={formData.eposta}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Konum:</label>
                                <input
                                    type="text"
                                    name="konum"
                                    value={formData.konum}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>İlgi Alanları:</label>
                                <input
                                    type="text"
                                    name="ilgi_alanlari"
                                    value={formData.ilgi_alanlari}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Telefon:</label>
                                <input
                                    type="text"
                                    name="telefon_no"
                                    value={formData.telefon_no}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Cinsiyet:</label>
                                <select
                                    name="cinsiyet"
                                    value={formData.cinsiyet}
                                    onChange={handleInputChange}
                                >
                                    <option value="Erkek">Erkek</option>
                                    <option value="Kadın">Kadın</option>
                                    <option value="Diğer">Diğer</option>
                                </select>
                            </div>
                            <div>
                                <label>Profil Fotoğrafı URL:</label>
                                <input
                                    type="text"
                                    name="profil_foto_url"
                                    value={formData.profil_foto_url}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">Güncelle</button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Ad:</strong> {userInfo.ad}</p>
                            <p><strong>Soyad:</strong> {userInfo.soyad}</p>
                            <p><strong>Kullanıcı Adı:</strong> {userInfo.kullanici_adi}</p>
                            <p><strong>Email:</strong> {userInfo.eposta}</p>
                            <p><strong>Konum:</strong> {userInfo.konum}</p>
                            <p><strong>İlgi Alanları:</strong> {userInfo.ilgi_alanlari}</p>
                            <p><strong>Telefon:</strong> {userInfo.telefon_no}</p>
                            <p><strong>Cinsiyet:</strong> {userInfo.cinsiyet}</p>
                            <button onClick={() => setIsEditing(true)}>Düzenle</button>
                            <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>
        Sil
    </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
}

export default MyAccount;
