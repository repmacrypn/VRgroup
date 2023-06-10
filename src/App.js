import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/common components/404/PageNotFound';
import FilterPage from './components/filterPage/FilterPage';
import LoginPage from './components/loginPage/LoginPage';
import React from 'react'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to='/loginPage' />} />
        <Route path='/loginPage' element={<LoginPage />} />
        <Route path='/filterPage' element={<FilterPage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
