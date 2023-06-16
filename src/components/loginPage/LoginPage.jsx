import React from 'react'
import { TextInput, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import s from './LoginPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/authSlice'
import { Navigate } from "react-router-dom"
import Preloader from '../common components/preloader/Preloader'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'

function LoginPage() {
    const authStatus = useSelector(state => state.auth.status)
    const isAuth = useSelector(selectIsAuth)

    if (authStatus === 'loading') return <Preloader />
    if (isAuth) return <Navigate to='/filterPage' />

    return (
        <div className={`${s.loginPageWrapper} defaultFontS`}>
            <div className={s.loginFormWrapper}>
                <div className={`${s.loginPageTitle} bold800`}>
                    Login to lorem ipsum
                </div>
                <div className={`${s.loginPageAbstract} regular400`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                </div>
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
                label="Email"
                type='email'
                placeholder="Enter your email"
                {...form.getInputProps('email')}
                styles={{
                    input: ms.textInput.input,
                }}
            />
            <TextInput
                label="Password"
                type='password'
                placeholder="Enter your password"
                {...form.getInputProps('password')}
                styles={{
                    input: ms.textInput.input,
                }}
            />
            <div className={s.errorMessage}>
                {authStatus === 'failed' ? error : ''}
            </div>
            <Button type="submit">Login</Button>
            {/* <div>
                test@nyblecraft.com
                12345678qQ
            </div> */}
        </form>
    )
}

export default LoginPage
