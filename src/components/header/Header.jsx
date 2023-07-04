import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../redux/authSlice'
import s from './Header.module.css'

export const Header = () => {
    const userData = useSelector(selectUserData)
    const userAvaName = userData?.firstName.slice(0, 1).toUpperCase() + userData?.lastName?.slice(0, 1).toUpperCase()

    return <HeaderData
        userAvaName={userAvaName}
    />
}

const HeaderData = ({ userAvaName }) => {
    return (
        <Link
            className={s.headerNavLink}
            to='/profilePage'
        >
            {userAvaName || 'NN'}
        </Link>
    )
}

HeaderData.propTypes = {
    userAvaName: PropTypes.string,
}