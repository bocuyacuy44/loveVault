import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaTag, FaMapMarkerAlt, FaCalendarAlt, FaImage } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Halaman Home dengan design modern minimalis
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
    return 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&crop=center';
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
        <div>
          <h1>Kenangan Indah Anda</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0.5rem 0'}}>
            Koleksi momen berharga yang tersimpan dengan indah
          </p>
        </div>
        <Link to="/memories/create" className="btn btn-primary btn-lg">
          <FaPlus /> Tambah Kenangan
        </Link>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Cari kenangan berdasarkan judul atau lokasi..."
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
          <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)'}}>
            <FaTag /> <span>Filter Tag:</span>
          </div>
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
          <div style={{fontSize: '4rem', color: 'var(--text-light)', marginBottom: 'var(--spacing-lg)'}}>
            <FaImage />
          </div>
          <h3>Belum ada kenangan tersimpan</h3>
          <p>Mulai simpan kenangan indah Anda dengan mengklik tombol "Tambah Kenangan" di atas</p>
          <Link to="/memories/create" className="btn btn-primary" style={{marginTop: 'var(--spacing-lg)'}}>
            <FaPlus /> Tambah Kenangan Pertama
          </Link>
        </div>
      ) : (
        <div className="memory-grid">
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <Link to={`/memories/${memory.id}`}>
                <div style={{position: 'relative', overflow: 'hidden'}}>
                  <img src={getCoverPhoto(memory)} alt={memory.title} />
                  {memory.Photos && memory.Photos.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaImage /> {memory.Photos.length}
                    </div>
                  )}
                </div>
                
                <div className="memory-card-content">
                  <h3 className="memory-card-title">{memory.title}</h3>
                  
                  {memory.location && (
                    <p className="memory-card-location">
                      <FaMapMarkerAlt /> {memory.location}
                    </p>
                  )}
                  
                  <p className="memory-card-date">
                    <FaCalendarAlt /> {formatDate(memory.memory_date || memory.created_at)}
                  </p>
                  
                  {memory.description && (
                    <p style={{
                      color: 'var(--text-secondary)', 
                      fontSize: '0.875rem',
                      lineHeight: '1.4',
                      marginTop: 'var(--spacing-sm)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {memory.description}
                    </p>
                  )}
                  
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