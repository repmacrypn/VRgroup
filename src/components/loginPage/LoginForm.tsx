import { Eye, EyeOff } from 'tabler-icons-react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { TextInput, Button, PasswordInput } from '@mantine/core'
import s from './LoginPage.module.css'
import { ms } from '../../styles/mantineStyles'
import { login, status } from '../../redux/authSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { StatusType } from '../../models/common/status.type'

interface IEmailPassword {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const dispatch = useAppDispatch()
    const error: string | null = useAppSelector(state => state.auth.error)

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    })

    const onSubmitButtonClick = ({ email, password }: IEmailPassword): void => {
        dispatch(login({ email, password }))
    }

    return <LoginFormInfo
        onSubmitButtonClick={onSubmitButtonClick}
        form={form}
        error={error}
    />
}

interface ILoginFormInfoProps {
    form: UseFormReturnType<{
        email: string;
        password: string;
    }, (values: {
        email: string;
        password: string;
    }) => {
        email: string;
        password: string;
    }>;
    error: string | null;
    onSubmitButtonClick: ({ email, password }: {
        email: string;
        password: string;
    }) => void;
}

const LoginFormInfo = ({ form, error, onSubmitButtonClick }: ILoginFormInfoProps) => {
    const isLoading: StatusType = useAppSelector(status)

    return (
        <form
            className={s.loginForm}
            onSubmit={form.onSubmit((values: IEmailPassword) => onSubmitButtonClick(values))}
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
                visibilityToggleIcon={({ reveal }: { reveal: boolean }) =>
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
