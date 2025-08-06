import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaTimes, FaEdit, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaFileAlt } from 'react-icons/fa';

// Halaman EditMemory dengan design modern minimalis
const EditMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    memory_date: new Date(),
    tags: ''
  });

  const { title, description, location, memory_date, tags } = formData;

  // Mengambil data kenangan yang akan diedit
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await axios.get(`/api/memories/${id}`);
        const memory = res.data;
        
        // Format tags dari array menjadi string
        const tagsString = memory.Tags ? memory.Tags.map(tag => tag.name).join(', ') : '';
        
        setFormData({
          title: memory.title,
          description: memory.description || '',
          location: memory.location || '',
          memory_date: memory.memory_date ? new Date(memory.memory_date) : new Date(),
          tags: tagsString
        });
        
        setLoading(false);
      } catch (err) {
        toast.error('Gagal memuat data kenangan');
        navigate('/');
      }
    };

    fetchMemory();
  }, [id, navigate]);

  // Update state saat input berubah
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update state untuk tanggal
  const handleDateChange = date => {
    setFormData({ ...formData, memory_date: date });
  };

  // Submit form untuk memperbarui kenangan
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

      await axios.put(`/api/memories/${id}`, memoryData);
      toast.success('Kenangan berhasil diperbarui');
      navigate(`/memories/${id}`);
    } catch (err) {
      toast.error(err.response?.data.message || 'Gagal memperbarui kenangan');
    }
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
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate(`/memories/${id}`)} className="btn btn-secondary">
          <FaArrowLeft /> Kembali
        </button>
        <h1>
          <FaEdit /> Edit Kenangan
        </h1>
      </div>

      {/* Form Card */}
      <div className="create-memory-container">
        <div className="create-memory-card">
          <div className="card-header">
            <h2>Edit Kenangan</h2>
            <p>Perbarui informasi tentang kenangan Anda</p>
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
                  <FaSave /> Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/memories/${id}`)}
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
          <h3>Tips Edit Kenangan</h3>
          <ul>
            <li>Pastikan judul tetap deskriptif dan mudah diingat</li>
            <li>Update lokasi jika ada perubahan</li>
            <li>Tambahkan atau edit tag sesuai kebutuhan</li>
            <li>Jangan lupa simpan perubahan setelah selesai edit</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditMemory;