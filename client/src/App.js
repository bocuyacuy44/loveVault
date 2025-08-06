import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Komponen
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Halaman
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MemoryDetail from './pages/MemoryDetail';
import CreateMemory from './pages/CreateMemory';
import EditMemory from './pages/EditMemory';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/memories/create" element={<PrivateRoute><CreateMemory /></PrivateRoute>} />
            <Route path="/memories/:id" element={<PrivateRoute><MemoryDetail /></PrivateRoute>} />
            <Route path="/memories/:id/edit" element={<PrivateRoute><EditMemory /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;