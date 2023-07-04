import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import s from './FilterPage.module.css'
import { setPageNumber, showPopUp } from '../../redux/filterSlice'
import '../../styles/fonts.css'
import popUpIcon from '../../assets/images/popUpIcon.svg'
import { FilterContext } from '../../context/contexts'

export const UpgragePopUp = () => {
    const dispatch = useDispatch()
    const itemsPerPage = useContext(FilterContext)

    const onConfirmClick = () => {
        dispatch(showPopUp(false))
        dispatch(setPageNumber(0))
    }

    const onDismissClick = () => {
        dispatch(showPopUp(false))
        dispatch(setPageNumber(Math.ceil(60 / itemsPerPage - 1)))
    }

    return (
        <div className={s.popUpVisible}>
            <img
                height={56}
                width={56}
                className={s.popUpIcon}
                src={popUpIcon}
                alt='popUpIcon'
            />
            <div className={s.popupParWrapper}>
                <div className={s.popUpTitle}>
                    Upgrade now
                </div>
                <div className={`${s.popUpAbstract} regular400`}>
                    You are on limited version which allows
                    viewing up to 60 contacts. Upgrade your plan to view all pages.
                </div>
            </div>
            <div className={`${s.popUpButWrapper} bold600`}>
                <NavLink
                    onClick={onConfirmClick}
                    className={s.popUpSubButton}
                    to='/upgradeVersionPage'
                >
                    Upgrade
                </NavLink>
                <div onClick={onDismissClick} className={s.popUpDismissButton}>
                    Maybe later
                </div>
            </div>
        </div>
    )
}