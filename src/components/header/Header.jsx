import React from "react"
import { Link } from "react-router-dom"
import { selectIsAuth } from "../../redux/authSlice"
import { useSelector } from "react-redux"
import s from './Header.module.css'

export const Header = () => {
    const userData = useSelector(selectIsAuth)
    const userAvaName = userData?.firstName.slice(0, 1).toUpperCase() + userData?.lastName?.slice(0, 1).toUpperCase()

    return (
        <div className={s.headerNavLink}>
            <Link to='/profilePage'>
                {userAvaName || 'NN'}
            </Link>
        </div>
    )
}