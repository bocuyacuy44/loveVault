import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaTag } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Home untuk menampilkan daftar kenangan pengguna
const Home = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const { } = useContext(AuthContext); // Menghapus variabel user yang tidak digunakan

  // Mengambil data kenangan saat komponen dimuat
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await axios.get('/api/memories');
        setMemories(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Gagal memuat kenangan');
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await axios.get('/api/tags');
        setTags(res.data);
      } catch (err) {
        console.error('Gagal memuat tag', err);
      }
    };

    fetchMemories();
    fetchTags();
  }, []);

  // Fungsi untuk mencari kenangan
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/memories/search?q=${searchTerm}`);
      setMemories(res.data);
    } catch (err) {
      toast.error('Gagal mencari kenangan');
    }
  };

  // Fungsi untuk filter berdasarkan tag
  const handleTagFilter = async (tagId) => {
    setSelectedTag(tagId);
    try {
      if (tagId) {
        const res = await axios.get(`/api/tags/${tagId}/memories`);
        setMemories(res.data);
      } else {
        // Jika tidak ada tag yang dipilih, tampilkan semua kenangan
        const res = await axios.get('/api/memories');
        setMemories(res.data);
      }
    } catch (err) {
      toast.error('Gagal memfilter kenangan');
    }
  };

  // Fungsi untuk mendapatkan foto sampul kenangan
  const getCoverPhoto = (memory) => {
    if (memory.Photos && memory.Photos.length > 0) {
      return `/uploads/${memory.Photos[0].file_path}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="home-header">
        <h1>Kenangan Saya</h1>
        <Link to="/memories/create" className="btn btn-primary">
          <FaPlus /> Tambah Kenangan
        </Link>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Cari kenangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              <FaSearch />
            </button>
          </div>
        </form>

        <div className="tag-filter">
          <FaTag /> Filter Tag:
          <select
            value={selectedTag}
            onChange={(e) => handleTagFilter(e.target.value)}
            className="form-control"
          >
            <option value="">Semua Tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="empty-state">
          <h3>Belum ada kenangan tersimpan</h3>
          <p>Mulai simpan kenangan indah Anda dengan mengklik tombol Tambah Kenangan</p>
        </div>
      ) : (
        <div className="memory-grid">
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <Link to={`/memories/${memory.id}`}>
                <img src={getCoverPhoto(memory)} alt={memory.title} />
                <div className="memory-card-content">
                  <h3 className="memory-card-title">{memory.title}</h3>
                  {memory.location && (
                    <p className="memory-card-location">{memory.location}</p>
                  )}
                  <p className="memory-card-date">
                    {formatDate(memory.memory_date || memory.created_at)}
                  </p>
                  {memory.Tags && memory.Tags.length > 0 && (
                    <div className="tags">
                      {memory.Tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="tag">
                          {tag.name}
                        </span>
                      ))}
                      {memory.Tags.length > 3 && (
                        <span className="tag">+{memory.Tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;