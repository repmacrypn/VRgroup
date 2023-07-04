import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { PageNotFound } from './components/common components/404/PageNotFound'
import { FilterPage } from './components/filterPage/FilterPage'
import { LoginPage } from './components/loginPage/LoginPage'
import { Header } from './components/header/Header'
import { ProfilePage } from './components/profilePage/ProfilePage'
import { selectIsAuth } from './redux/authSlice'
import { UpgradePage } from './components/upgradePage/UpgradePage'

function App() {
    const userData = useSelector(selectIsAuth)
    return (
        <div className="appWrapper">
            {userData && < Header />}
            <Routes>
                <Route path='/' element={<Navigate to='/loginPage' />} />
                <Route path='/loginPage' element={<LoginPage />} />
                <Route path='/filterPage' element={<FilterPage />} />
                <Route path='/upgradeVersionPage' element={<UpgradePage />} />
                <Route path='/profilePage' element={<ProfilePage />} />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </div>
    )
}

export default App
