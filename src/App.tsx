import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ScanPage from '@/pages/ScanPage';
import RoomPage from '@/pages/RoomPage';
import QrCodesPage from '@/pages/QrCodesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/qr-codes" element={<QrCodesPage />} />
        <Route path="/room1" element={<RoomPage />} />
        <Route path="/room2" element={<RoomPage />} />
        <Route path="/room3" element={<RoomPage />} />
        <Route path="/room4" element={<RoomPage />} />
        <Route path="/room5" element={<RoomPage />} />
        <Route path="/room6" element={<RoomPage />} />
        <Route path="/room7" element={<RoomPage />} />
        <Route path="/room8" element={<RoomPage />} />
        <Route path="/room9" element={<RoomPage />} />
        <Route path="/room10" element={<RoomPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
