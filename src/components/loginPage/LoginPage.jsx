import React from 'react'
import PropTypes from 'prop-types'
import { Eye, EyeOff } from 'tabler-icons-react'
import { TextInput, Button, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import s from './LoginPage.module.css'
import { status, login } from '../../redux/authSlice'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'

function LoginPage() {
    const isAuth = useSelector(selectIsAuth)
    if (isAuth) return <Navigate to='/filterPage' />

    console.log('1 login props (top)')

    return (
        <div className={`${s.loginPageWrapper} defaultFontS`}>
            <LoginDataField />
            <LoginIntroField />
        </div>
    )
}

const LoginDataField = () => {
    console.log('2 login props (mid) left')

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

const LoginIntroField = () => {
    console.log('2 login props (mid) right')

    return (
        <div className={s.loginIntroPic}>
            <div className={`${s.logo} bold800`}>
                VRgroup
            </div>
            <div className={`${s.logoSlogan} bold800`}>
                Find and contact every potential customer in the world
            </div>
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
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    const onSubmitButtonClick = ({ email, password }) => {
        dispatch(login({ email, password }))
    }

    console.log('2 login props (middle)')

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
                    label: ms.textInput.label,
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
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.loginRoot),
                }}
            >
                Login
            </Button>
        </form>
    )
}

const LoginData = () => {
    console.log('3 login props (middle)')
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

    console.log('4 login props (bottom)')
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

export default LoginPage
