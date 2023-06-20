import React from 'react'
import { TextInput, Button, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import s from './LoginPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/authSlice'
import { Navigate } from "react-router-dom"
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { Eye, EyeOff } from 'tabler-icons-react'

function LoginPage() {
    const isAuth = useSelector(selectIsAuth)

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
                <LoginForm />
            </div>
            <div className={s.loginIntroPic}>
                <div className={`${s.logo} bold800`}>
                    VRgroup
                </div>
                <div className={`${s.logoSlogan} bold800`}>
                    Find and contact every potential customer in the world
                </div>
            </div>
        </div>
    )
}

const LoginForm = () => {
    const error = useSelector(state => state.auth.error)
    const isLoading = useSelector(state => state.auth.status)
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
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.emailInput),
                    label: ms.textInput.label
                }}
            />
            <PasswordInput
                label="Password"
                visibilityToggleIcon={({ reveal }) =>
                    reveal ? <Eye /> : <EyeOff />}
                placeholder="Enter your password"
                {...form.getInputProps('password')}
                styles={{
                    input: ms.passwordInput.input,
                    label: ms.passwordInput.label,
                    innerInput: ms.passwordInput.innerInput,
                    rightSection: ms.passwordInput.rightSection,
                }}
            />
            {
                error &&
                <div className={s.errorMessage}>
                    {error}
                </div>
            }
            <Button
                disabled={isLoading === 'loading'}
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

const LoginData = () => {
    return (
        <div className={s.loginDataWrapper}>
            <LoginDataProp title='Email: ' value='test@nyblecraft.com' />
            <LoginDataProp title='Password: ' value='12345678qQ' />
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

export default LoginPage
