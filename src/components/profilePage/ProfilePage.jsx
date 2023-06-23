import { Input } from "@mantine/core"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import { logout } from "../../redux/authSlice"
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ArrowLeft, Logout } from "tabler-icons-react"

export const ProfilePage = () => {
    const userData = useSelector(state => state.auth.userData)
    const dispatch = useDispatch()

    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    const logoutOnClick = () => {
        dispatch(logout())
    }

    if (!userData) return <Navigate to='/loginPage' />

    return (
        <div className={`defaultFontS`}>
            <div className={`bold900 ${s.logoTitle}`}>
                VRgroup
            </div>
            <div className={s.profileWrapper}>
                <div className={s.profileInfoWrapper}>
                    <Link className={`${s.backToMainLink} bold600`} to='/filterPage'>
                        <ArrowLeft viewBox="0 -5 24 24" height={18} width={26} />
                        Back to search
                    </Link>
                    <div className={s.profileInfoTable}>
                        <div className={s.profileHeader}>
                            <div className={s.profileTitle}>
                                Account info
                            </div>
                            <div
                                className={`bold600 ${s.profileAbstract}`}
                                onClick={logoutOnClick}
                            >
                                <Logout viewBox="0 -2 24 24" height={14} width={26} />
                                Log out
                            </div>
                        </div>
                        <div className={s.nameSurnameWrapper}>
                            <div className={s.nameWrapper}>
                                <div className={`bold600`}>
                                    First Name
                                </div>
                                <div>
                                    {userData.firstName}
                                </div>
                            </div>
                            <div className={s.surnameWrapper}>
                                <div className={`bold600`}>
                                    Last Name
                                </div>
                                <div>
                                    {userData.lastName}
                                </div>
                            </div>
                        </div>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className={s.profileSubscribtion}>
                    Subscription
                </div>
            </div>
        </div>
    )
}