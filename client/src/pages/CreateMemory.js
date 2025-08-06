import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaTimes, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaFileAlt, FaArrowLeft } from 'react-icons/fa';

// Halaman CreateMemory dengan design modern minimalis
const CreateMemory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    memory_date: new Date(),
    tags: ''
  });

  const { title, description, location, memory_date, tags } = formData;

  // Update state saat input berubah
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update state untuk tanggal
  const handleDateChange = date => {
    setFormData({ ...formData, memory_date: date });
  };

  // Submit form untuk membuat kenangan baru
  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      // Konversi string tags menjadi array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const memoryData = {
        title,
        description,
        location,
        memory_date,
        tags: tagsArray
      };

      const res = await axios.post('/api/memories', memoryData);
      toast.success('Kenangan berhasil dibuat');
      navigate(`/memories/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data.message || 'Gagal membuat kenangan');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          <FaArrowLeft /> Kembali
        </button>
        <h1>
          <FaPlus /> Buat Kenangan Baru
        </h1>
      </div>

      {/* Form Card */}
      <div className="create-memory-container">
        <div className="create-memory-card">
          <div className="card-header">
            <h2>Detail Kenangan</h2>
            <p>Isi informasi tentang kenangan yang ingin Anda simpan</p>
          </div>

          <div className="card-body">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="title">
                  <FaFileAlt /> Judul Kenangan *
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Berikan judul yang bermakna untuk kenangan ini"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <FaFileAlt /> Deskripsi
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={onChange}
                  className="form-control"
                  rows="5"
                  placeholder="Ceritakan lebih detail tentang kenangan ini..."
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">
                    <FaMapMarkerAlt /> Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Jakarta, Bali, Paris, dll."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="memory_date">
                    <FaCalendarAlt /> Tanggal Kenangan
                  </label>
                  <DatePicker
                    selected={memory_date}
                    onChange={handleDateChange}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                    placeholderText="Pilih tanggal"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">
                  <FaTag /> Tag (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={tags}
                  onChange={onChange}
                  className="form-control"
                  placeholder="liburan, keluarga, ulang tahun, romantis"
                />
                <small className="form-hint">
                  Tag membantu Anda mengorganisir dan mencari kenangan dengan mudah
                </small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-lg">
                  <FaSave /> Simpan Kenangan
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary btn-lg"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>Tips Membuat Kenangan</h3>
          <ul>
            <li>Gunakan judul yang deskriptif dan mudah diingat</li>
            <li>Tambahkan detail lokasi untuk konteks yang lebih baik</li>
            <li>Gunakan tag untuk mempermudah pencarian nanti</li>
            <li>Setelah menyimpan, Anda dapat menambahkan foto-foto</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateMemory;