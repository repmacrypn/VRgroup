import React from 'react'
import { TextInput, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import s from './LoginPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/authSlice'
import { Navigate } from "react-router-dom";
import Preloader from '../common components/preloader/Preloader'

function LoginPage() {
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        }
    })

    const dispatch = useDispatch()

    const authStatus = useSelector(state => state.auth.status)
    const isAuth = useSelector(state => state.auth.authData?.user)
    const error = useSelector(state => state.auth.error)

    const onSubmitButtonClick = ({ email, password }) => {
        dispatch(login({ email, password }))
    }

    if (authStatus === 'loading') return <Preloader />
    if (isAuth) return <Navigate to='/filterPage' />

    return (
        <form onSubmit={form.onSubmit((values) => onSubmitButtonClick(values))}>
            <TextInput
                label="Email"
                placeholder="Enter your email"
                {...form.getInputProps('email')}
            />
            <TextInput
                label="Password"
                placeholder="Enter your password"
                {...form.getInputProps('password')}
            />
            <div className={s.errorMessage}>
                {authStatus === 'failed' ? error : ''}
            </div>
            <Button type="submit">Login</Button>
        </form>
    )
}

export default LoginPage;
