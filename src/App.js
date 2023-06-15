import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/common components/404/PageNotFound';
import FilterPage from './components/filterPage/FilterPage';
import LoginPage from './components/loginPage/LoginPage';
import React from 'react'
import { Header } from './components/header/Header';
import { ProfilePage } from './components/profilePage/ProfilePage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Navigate to='/loginPage' />} />
        <Route path='/loginPage' element={<LoginPage />} />
        <Route path='/filterPage' element={<FilterPage />} />
        <Route path='/profilePage' element={<ProfilePage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
