import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaTags, FaUpload } from 'react-icons/fa';

// Halaman MemoryDetail untuk menampilkan detail kenangan dan foto-fotonya
const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadForm, setUploadForm] = useState({
    file: null,
    caption: ''
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Mengambil data kenangan berdasarkan ID
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await axios.get(`/api/memories/${id}`);
        setMemory(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Gagal memuat kenangan');
        setLoading(false);
        navigate('/');
      }
    };

    fetchMemory();
  }, [id, navigate]);

  // Fungsi untuk menghapus kenangan
  const deleteMemory = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kenangan ini?')) {
      try {
        await axios.delete(`/api/memories/${id}`);
        toast.success('Kenangan berhasil dihapus');
        navigate('/');
      } catch (err) {
        toast.error('Gagal menghapus kenangan');
      }
    }
  };

  // Fungsi untuk mengunggah foto baru
  const handleFileChange = (e) => {
    setUploadForm({
      ...uploadForm,
      file: e.target.files[0]
    });
  };

  const handleCaptionChange = (e) => {
    setUploadForm({
      ...uploadForm,
      caption: e.target.value
    });
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', uploadForm.file);
    formData.append('caption', uploadForm.caption);

    try {
      await axios.post(`/api/photos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh data kenangan
      const res = await axios.get(`/api/memories/${id}`);
      setMemory(res.data);

      // Reset form
      setUploadForm({
        file: null,
        caption: ''
      });
      setShowUploadForm(false);
      toast.success('Foto berhasil diunggah');
    } catch (err) {
      toast.error('Gagal mengunggah foto');
    }
  };

  // Fungsi untuk menghapus foto
  const deletePhoto = async (photoId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      try {
        await axios.delete(`/api/photos/${photoId}`);
        
        // Refresh data kenangan
        const res = await axios.get(`/api/memories/${id}`);
        setMemory(res.data);
        
        // Reset selected photo jika yang dihapus adalah foto yang sedang dipilih
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(null);
        }
        
        toast.success('Foto berhasil dihapus');
      } catch (err) {
        toast.error('Gagal menghapus foto');
      }
    }
  };

  // Fungsi untuk memperbarui caption foto
  const updatePhotoCaption = async (photoId) => {
    try {
      await axios.put(`/api/photos/${photoId}`, { caption: photoCaption });
      
      // Refresh data kenangan
      const res = await axios.get(`/api/memories/${id}`);
      setMemory(res.data);
      
      // Update selected photo dengan caption baru
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, caption: photoCaption });
      }
      
      toast.success('Caption berhasil diperbarui');
    } catch (err) {
      toast.error('Gagal memperbarui caption');
    }
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
    <div className="memory-detail">
      <div className="memory-detail-header">
        <h1>{memory.title}</h1>
        <div className="memory-actions">
          <Link to={`/memories/${id}/edit`} className="btn btn-secondary">
            <FaEdit /> Edit
          </Link>
          <button onClick={deleteMemory} className="btn btn-danger">
            <FaTrash /> Hapus
          </button>
        </div>
      </div>

      <div className="memory-detail-info">
        {memory.location && (
          <p className="memory-location">
            <FaMapMarkerAlt /> {memory.location}
          </p>
        )}
        <p className="memory-date">
          <FaCalendarAlt /> {formatDate(memory.memory_date || memory.created_at)}
        </p>
      </div>

      {memory.description && (
        <div className="memory-description">
          <p>{memory.description}</p>
        </div>
      )}

      {memory.Tags && memory.Tags.length > 0 && (
        <div className="memory-tags">
          <FaTags /> 
          <div className="tags">
            {memory.Tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="photo-section">
        <div className="photo-header">
          <h2>Foto Kenangan</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            <FaUpload /> {showUploadForm ? 'Batal' : 'Tambah Foto'}
          </button>
        </div>

        {showUploadForm && (
          <div className="upload-form">
            <form onSubmit={uploadPhoto}>
              <div className="form-group">
                <label htmlFor="photo">Pilih Foto</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="caption">Caption</label>
                <input
                  type="text"
                  id="caption"
                  value={uploadForm.caption}
                  onChange={handleCaptionChange}
                  className="form-control"
                  placeholder="Deskripsi singkat foto"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={!uploadForm.file}
              >
                Unggah Foto
              </button>
            </form>
          </div>
        )}

        {memory.Photos && memory.Photos.length > 0 ? (
          <div className="photo-gallery">
            {memory.Photos.map((photo) => (
              <div key={photo.id} className="photo-item">
                <img
                  src={`/uploads/${photo.file_path}`}
                  alt={photo.caption || 'Foto kenangan'}
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setPhotoCaption(photo.caption || '');
                  }}
                />
                {photo.caption && <div className="photo-caption">{photo.caption}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-photos">
            <p>Belum ada foto untuk kenangan ini</p>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/uploads/${selectedPhoto.file_path}`}
              alt={selectedPhoto.caption || 'Foto kenangan'}
              className="modal-photo"
            />
            <div className="modal-actions">
              <div className="caption-edit">
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="form-control"
                  placeholder="Tambahkan caption"
                />
                <button
                  onClick={() => updatePhotoCaption(selectedPhoto.id)}
                  className="btn btn-secondary"
                >
                  Simpan Caption
                </button>
              </div>
              <button
                onClick={() => deletePhoto(selectedPhoto.id)}
                className="btn btn-danger"
              >
                <FaTrash /> Hapus Foto
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="btn btn-primary"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryDetail;