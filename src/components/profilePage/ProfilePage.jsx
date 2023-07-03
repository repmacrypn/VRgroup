import { Button } from '@mantine/core'
import React, { useMemo } from 'react'
import { ArrowLeft, Logout, UserPlus } from 'tabler-icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Navigate } from 'react-router-dom'
import { logout, selectIsAuth } from '../../redux/authSlice'
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { getCurDate } from '../../utilites/getCurDate'
import { LoginDataInfo, NameSurnameInfo } from './UserCredentials'

export const ProfilePage = () => {
    const isAuth = useSelector(selectIsAuth)
    if (!isAuth) return <Navigate to='/loginPage' />

    return (
        <div className={'defaultFontS'}>
            <div className={`bold900 ${s.logoTitle}`}>
                VRgroup
            </div>
            <div className={s.profileWrapper}>
                <Profile />
                <Subscription />
            </div>
        </div>
    )
}

const Profile = () => {
    return (
        <div className={s.profileInfoWrapper}>
            <BackToSearch />
            <div className={s.profileInfoTable}>
                <div className={s.profileHeader}>
                    <div className={s.profileTitle}>
                        Account info
                    </div>
                    <LogOut />
                </div>
                <NameSurnameInfo />
                <LoginDataInfo />
            </div>
        </div>
    )
}

const Subscription = () => {
    const date = useMemo(() => getCurDate(), [])

    return (
        <div className={s.subscribtionWrapper}>
            <div className={`bold700 ${s.subscriptionTitle}`}>
                Subscription
            </div>
            <div className={s.subscriptionPlan}>
                <div className={s.subPlanWrapper}>
                    <div className={s.subPlanTitle}>
                        Free Plan
                    </div>
                    <div className={`${s.subPlanAbstract} regular400`}>
                        You are on a free plan
                        and your credits will refresh on {date}.
                    </div>
                </div>
                <NavUpgrdButton />
            </div>
        </div>
    )
}

const NavUpgrdButton = () => {
    return (
        <NavLink
            className={s.subNavLink}
            to='/upgradeVersionPage'
        >
            <Button
                radius='md'
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.subRoot),
                }}
            >
                <UserPlus color="white" viewBox="0 0 24 24" height={18} width={24} />
                Change plan
            </Button>
        </NavLink>
    )
}

export const BackToSearch = () => {
    return (
        <NavLink className={`${s.backToMainLink} bold600`} to='/filterPage'>
            <ArrowLeft viewBox="0 -5 24 24" height={18} width={26} />
            Back to search
        </NavLink>
    )
}

export const LogOut = () => {
    const dispatch = useDispatch()

    const logoutOnClick = () => {
        dispatch(logout())
    }

    return (
        <div
            className={`${s.profileLogOut} bold600`}
            onClick={logoutOnClick}
        >
            <Logout viewBox="0 -2 24 24" height={14} width={26} />
            Log out
        </div>
    )
}