import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Peserta from './pages/Peserta';
import PresensiMagang from './pages/PresensiMagang';
import Penugasan from './pages/Penugasan';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Data from './pages/user/Data'
import Presensi from './pages/user/Presensi';
import Tugas from './pages/user/Tugas';
import UserPages from './pages/user/UserPages';
import Admin from './pages/Admin';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route exact path="/" element={<LoginSignup />}/>
        <Route path="user/presensi/riwayat" element={<Data/>}/>
        <Route path="user/presensi" element={<Presensi/>}/>
        <Route path="user/tugas" element={<Tugas/>}/>
        <Route path="user/homepage" element={<UserPages />}/>

        <Route path='admin' element={<Admin />} />
        <Route path="homepage" element={<Homepage />}/>
        <Route path='peserta' element={<Peserta />}/>
        <Route path='presensi' element={<PresensiMagang />}/>
        <Route path='penugasan' element={<Penugasan />}/>   
      </Routes>
    </BrowserRouter>
  );
};

export default App;