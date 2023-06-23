import { TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import { logout } from "../../redux/authSlice"
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ArrowLeft, Logout } from "tabler-icons-react"
import { ms } from "../../styles/mantineStyles"

export const ProfilePage = () => {
    const userData = useSelector(state => state.auth.userData)
    const dispatch = useDispatch()

    const [name, setName] = useState(userData?.firstName)
    const [surname, setSurname] = useState(userData?.lastName)

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
                                <TextInput
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Change username..."
                                    radius="md"
                                    styles={{
                                        input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.nameSurnameInput),
                                    }}
                                />
                            </div>
                            <div className={s.surnameWrapper}>
                                <div className={`bold600`}>
                                    Last Name
                                </div>
                                <TextInput
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    placeholder="Change surname..."
                                    radius="md"
                                    styles={{
                                        input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.nameSurnameInput),
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            {userData.email}
                        </div>
                        <div>
                            hidden:)
                        </div>
                    </div>
                </div>
                <div className={s.profileSubscribtion}>
                    Subscription
                </div>
            </div>
        </div>
    )
}