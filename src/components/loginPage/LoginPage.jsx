import React from 'react'
import { TextInput, Button, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import s from './LoginPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/authSlice'
import { Navigate } from "react-router-dom"
import Preloader from '../common components/preloader/Preloader'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import eyeOpened from '../../assets/images/eye.svg'
import eyeClosed from '../../assets/images/eye-closed.svg'

function LoginPage() {
    const authStatus = useSelector(state => state.auth.status)
    const isAuth = useSelector(selectIsAuth)

    if (authStatus === 'loading') return <Preloader />
    if (isAuth) return <Navigate to='/filterPage' />

    return (
        <div className={`${s.loginPageWrapper} defaultFontS`}>
            <div className={s.loginFormWrapper}>
                <div className={`${s.loginPageTitle} bold800`}>
                    Login
                </div>
                <div className={`${s.loginPageAbstract} regular400`}>
                    Welcome! Login to your account - find more potential customers.
                </div>
                <LoginData />
                <LoginForm
                    authStatus={authStatus}
                />
            </div>
            <div className={s.loginIntroPic}>
                qq
            </div>
        </div>
    )
}

const LoginForm = ({ authStatus }) => {
    const error = useSelector(state => state.auth.error)
    const dispatch = useDispatch()

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        }
    })

    const onSubmitButtonClick = ({ email, password }) => {
        dispatch(login({ email, password }))
    }

    return (
        <form
            className={s.loginForm}
            onSubmit={form.onSubmit((values) => onSubmitButtonClick(values))}
        >
            <TextInput
                inputWrapperOrder={['label', 'error', 'input']}
                radius="md"
                label="Email"
                type='email'
                placeholder="Enter your email"
                {...form.getInputProps('email')}
                styles={{
                    input: ms.textInput.input,
                    label: ms.textInput.label
                }}
            />
            <PasswordInput
                radius="md"
                label="Password"
                visibilityToggleIcon={({ reveal }) =>
                    reveal ? <EyeOpened /> : <EyeClosed />}
                placeholder="Enter your password"
                {...form.getInputProps('password')}
                styles={{
                    input: ms.passwordInput.input,
                    label: ms.passwordInput.label,
                    innerInput: ms.passwordInput.innerInput,
                }}
            />
            <div className={s.errorMessage}>
                {authStatus === 'failed' ? error : null}
            </div>
            <Button
                radius='md'
                type="submit"
                styles={{
                    root: ms.button.root,
                }}
            >
                Login
            </Button>
        </form>
    )
}

const EyeOpened = () => {
    return (
        <div className={s.eyeIcon}>
            <img alt='eye icon opened' src={eyeOpened} />
        </div>
    )
}

const EyeClosed = () => {
    return (
        <div className={s.eyeIcon}>
            <img alt='eye icon closed' src={eyeClosed} />
        </div>
    )
}

const LoginData = () => {
    return (
        <div className={s.loginDataWrapper}>
            <div>
                <span className='bold600'>
                    Email:
                </span>
                <span className='regular400'>
                    test@nyblecraft.com
                </span>
            </div>
            <div>
                <span className='bold600'>
                    Password:
                </span>
                <span className='regular400'>
                    12345678qQ
                </span>
            </div>
        </div>
    )
}

export default LoginPage
