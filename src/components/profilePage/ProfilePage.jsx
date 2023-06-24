import { Button, TextInput } from '@mantine/core'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Navigate } from 'react-router-dom'
import { changeUserCreds, logout } from '../../redux/authSlice'
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ArrowLeft, Edit, Logout, UserPlus } from 'tabler-icons-react'
import { ms } from '../../styles/mantineStyles'
import { getCurDate } from '../../utilites/getCurDate'
import PropTypes from 'prop-types'

export const ProfilePage = () => {
    const userData = useSelector(state => state.auth.userData)
    const status = useSelector(state => state.auth.status)
    const dispatch = useDispatch()

    const date = useMemo(() => getCurDate(), [])

    const [name, setName] = useState(userData?.firstName)
    const [surname, setSurname] = useState(userData?.lastName)
    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    const logoutOnClick = () => {
        dispatch(logout())
    }

    const changeUserDataOnClick = () => {
        dispatch(changeUserCreds({ name, surname }))
    }

    if (!userData) return <Navigate to='/loginPage' />

    return (
        <div className={'defaultFontS'}>
            <div className={`bold900 ${s.logoTitle}`}>
                VRgroup
            </div>
            <div className={s.profileWrapper}>
                <div className={s.profileInfoWrapper}>
                    <BackToSearch />
                    <div className={s.profileInfoTable}>
                        <div className={s.profileHeader}>
                            <div className={s.profileTitle}>
                                Account info
                            </div>
                            <div
                                className={`${s.profileLogOut} bold600`}
                                onClick={logoutOnClick}
                            >
                                <Logout viewBox="0 -2 24 24" height={14} width={26} />
                                Log out
                            </div>
                        </div>
                        <div className={s.nameSurnameWrapper}>
                            <div className={s.nameWrapper}>
                                <div className={'bold600'}>
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
                                <div className={'bold600'}>
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
                        <Button
                            onClick={changeUserDataOnClick}
                            disabled={status === 'loading'}
                            radius='md'
                            styles={{
                                root: Object.assign({}, ms.button.defaultRoot, ms.button.profileRoot),
                            }}
                        >
                            Change user creds
                        </Button>
                        <div>
                            <TextInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Change email..."
                                variant="unstyled"
                                rightSectionWidth={125}
                                rightSection={<RightSection text='Change email' />}
                                styles={{
                                    rightSection: ms.textInput.rightSection,
                                    wrapper: ms.textInput.profileEmailPasswordWrapper,
                                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.profileEmailInput, ms.textInput.profileEmailPasswordInput),
                                }}
                            />
                            <TextInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Change password..."
                                variant="unstyled"
                                rightSectionWidth={155}
                                rightSection={<RightSection text='Change password' />}
                                styles={{
                                    rightSection: ms.textInput.rightSection,
                                    wrapper: ms.textInput.profileEmailPasswordWrapper,
                                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.profileEmailPasswordInput),
                                }}
                            />
                        </div>
                    </div>
                </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

const RightSection = ({ text }) => {
    return (
        <div className={`${s.rightSection} bold600`}>
            <Edit viewBox="0 -2 24 24" height={18} width={26} />
            {text}
        </div>
    )
}

RightSection.propTypes = {
    text: PropTypes.string,
}

export const BackToSearch = () => {
    return (
        <NavLink className={`${s.backToMainLink} bold600`} to='/filterPage'>
            <ArrowLeft viewBox="0 -5 24 24" height={18} width={26} />
            Back to search
        </NavLink>
    )
}