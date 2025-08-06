import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';

// Halaman EditMemory untuk mengedit kenangan yang sudah ada
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
    <div className="form-container memory-form">
      <h1>
        <FaEdit /> Edit Kenangan
      </h1>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Judul Kenangan</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            className="form-control"
            rows="5"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="location">Lokasi</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={onChange}
            className="form-control"
            placeholder="Contoh: Jakarta, Bali, dll."
          />
        </div>

        <div className="form-group">
          <label htmlFor="memory_date">Tanggal Kenangan</label>
          <DatePicker
            selected={memory_date}
            onChange={handleDateChange}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tag (pisahkan dengan koma)</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={onChange}
            className="form-control"
            placeholder="Contoh: liburan, keluarga, ulang tahun"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FaSave /> Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate(`/memories/${id}`)}
            className="btn btn-secondary"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMemory;