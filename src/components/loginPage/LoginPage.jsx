import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from '@mantine/form'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import s from './LoginPage.module.css'
import { status, login } from '../../redux/authSlice'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { LoginFormInfo } from './LoginForm'

function LoginPage() {
    const isAuth = useSelector(selectIsAuth)
    if (isAuth) return <Navigate to='/filterPage' />

    return (
        <div className={`${s.loginPageWrapper} defaultFontS`}>
            <LoginDataField />
            <LoginIntroField />
        </div>
    )
}

const LoginDataField = () => {
    return (
        <div className={s.loginFormWrapper}>
            <div className={`${s.loginPageTitle} bold800`}>
                Login
            </div>
            <div className={`${s.loginPageAbstract} regular400`}>
                Welcome! Login to your account - find more potential customers.
            </div>
            <LoginData />
            <LoginForm />
        </div>
    )
}

const LoginForm = () => {
    const dispatch = useDispatch()
    const error = useSelector(state => state.auth.error)
    const isLoading = useSelector(status)

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    })

    const onSubmitButtonClick = ({ email, password }) => {
        dispatch(login({ email, password }))
    }

    return <LoginFormInfo
        onSubmitButtonClick={onSubmitButtonClick}
        form={form}
        error={error}
        isLoading={isLoading}
    />
}

const LoginData = () => {
    return (
        <div className={s.loginDataWrapper}>
            <LoginDataProp
                title='Email: '
                value='test@nyblecraft.com'
            />
            <LoginDataProp
                title='Password: '
                value='12345678qQ'
            />
        </div>
    )
}

const LoginDataProp = ({ title, value }) => {
    return (
        <div>
            <span className='bold600'>
                {title}
            </span>
            <span className='regular400'>
                {value}
            </span>
        </div>
    )
}

LoginDataProp.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
}

const LoginIntroField = () => {
    return (
        <>
            <div className={s.loginIntroPic}>
                <div className={s.logoWrapper}>
                    <div className={`${s.logo} bold800`}>
                        VRgroup
                    </div>
                    <div className={`${s.logoSlogan} bold800`}>
                        Find and contact every potential customer in the world
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage
