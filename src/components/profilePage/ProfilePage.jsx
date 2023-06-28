import { Button, TextInput } from '@mantine/core'
import React, { useContext, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Navigate } from 'react-router-dom'
import { changeUserCreds, logout, selectIsAuth, status } from '../../redux/authSlice'
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ArrowLeft, Edit, Logout, UserPlus } from 'tabler-icons-react'
import { ms } from '../../styles/mantineStyles'
import { getCurDate } from '../../utilites/getCurDate'
import PropTypes from 'prop-types'

export const ProfileContext = React.createContext(null)

export const ProfilePage = () => {
    const userData = useSelector(selectIsAuth)
    if (!userData) return <Navigate to='/loginPage' />

    console.log('1 top component')

    return (
        <ProfileContext.Provider value={userData}>
            <div className={'defaultFontS'}>
                <div className={`bold900 ${s.logoTitle}`}>
                    VRgroup
                </div>
                <div className={s.profileWrapper}>
                    <ProfileInfo />
                    <SubscriptionInfo />
                </div>
            </div>
        </ProfileContext.Provider>
    )
}

const ProfileInfo = () => {
    console.log('2 profile info component wrapper')

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

const NameSurnameInfo = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector(status)

    const userData = useContext(ProfileContext)

    const [name, setName] = useState(userData?.firstName)
    const [surname, setSurname] = useState(userData?.lastName)

    const changeUserDataOnClick = () => {
        dispatch(changeUserCreds({ name, surname }))
    }

    console.log('3 profile info component name surname inputs')

    return (
        <>
            <div className={s.nameSurnameWrapper}>
                <CustomTextInput
                    placeholder='Change username...'
                    text='First Name'
                    value={name}
                    setValue={setName}
                    classN='nameWrapper'
                />
                <CustomTextInput
                    placeholder='Change surname...'
                    text='Last Name'
                    value={surname}
                    setValue={setSurname}
                    classN='surnameWrapper'
                />
            </div>
            <Button
                onClick={changeUserDataOnClick}
                disabled={isLoading === 'loading'}
                radius='md'
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.profileRoot),
                }}
            >
                Change user creds
            </Button>
        </>
    )
}

const CustomTextInput = React.memo(({ classN, text, value, setValue, placeholder }) => {
    console.log('4 customized input')

    return (
        <div className={s[classN]}>
            <div className={'bold600'}>
                {text}
            </div>
            <TextInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                radius="md"
                styles={{
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.nameSurnameInput),
                }}
            />
        </div>
    )
})

CustomTextInput.displayName = 'CustomSur(Name)TextInput'

CustomTextInput.propTypes = {
    classN: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    setValue: PropTypes.func,
}

const LoginDataInfo = () => {
    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    console.log('3 profile info component login data inputs')

    return (
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
    )
}

const SubscriptionInfo = () => {
    const date = useMemo(() => getCurDate(), [])

    console.log('2 subscription info component wrapper')

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
    console.log('3 subscription info button')

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

const RightSection = React.memo(({ text }) => {
    console.log('rightSection (text input)')

    return (
        <div className={`${s.rightSection} bold600`}>
            <Edit viewBox="0 -2 24 24" height={18} width={26} />
            {text}
        </div>
    )
})

RightSection.displayName = 'RightSection'

RightSection.propTypes = {
    text: PropTypes.string,
}

export const BackToSearch = () => {
    console.log('back to search')

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

    console.log('logOut')

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
