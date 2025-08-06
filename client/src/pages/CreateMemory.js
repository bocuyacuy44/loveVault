import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';

// Halaman CreateMemory untuk membuat kenangan baru
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
    <div className="form-container memory-form">
      <h1>
        <FaPlus /> Buat Kenangan Baru
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
            <FaSave /> Simpan Kenangan
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMemory;