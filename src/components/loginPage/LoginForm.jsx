import React from 'react'
import PropTypes from 'prop-types'
import { Eye, EyeOff } from 'tabler-icons-react'
import { useForm } from '@mantine/form'
import { TextInput, Button, PasswordInput } from '@mantine/core'
import { useDispatch, useSelector } from 'react-redux'
import s from './LoginPage.module.css'
import { ms } from '../../styles/mantineStyles'
import { login, status } from '../../redux/authSlice'

export const LoginForm = () => {
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

const LoginFormInfo = ({ form, error, isLoading, onSubmitButtonClick }) => {
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


LoginFormInfo.propTypes = {
    form: PropTypes.object,
    error: PropTypes.string,
    isLoading: PropTypes.string,
    onSubmitButtonClick: PropTypes.func,
}
