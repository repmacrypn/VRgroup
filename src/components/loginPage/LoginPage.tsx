import { Navigate } from 'react-router-dom'
import s from './LoginPage.module.css'
import { LoginForm } from './LoginForm'
import '../../styles/fonts.css'
import { selectIsAuth } from '../../redux/authSlice'
import { useAppSelector } from '../../hooks/useAppHooks'
import { IDataProps } from '../../models/common/textValueProps.interface'

export const LoginPage = () => {
    const isAuth: boolean = useAppSelector(selectIsAuth)
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
            <div className={s.dataWrapper}>
                <LoginData />
                <LoginAccessTip />
            </div>
            <LoginForm />
        </div>
    )
}

const LoginData = () => {
    return (
        <div className={s.loginDataWrapper}>
            <LoginDataProp
                text='Email: '
                value='test@nyblecraft.com'
            />
            <LoginDataProp
                text='Password: '
                value='12345678qQ'
            />
        </div>
    )
}

const LoginDataProp = ({ text, value }: IDataProps) => {
    return (
        <div>
            <span className='bold600'>
                {text}
            </span>
            <span className='regular400'>
                {value}
            </span>
        </div>
    )
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

const LoginAccessTip = () => {
    return (
        <div className={s.loginAccessTipWrapper}>
            Due to some CORS problems to enable the login button you need to
            visit this {' '}
            <a
                href='https://cors-anywhere.herokuapp.com/corsdemo'
                target='_blank'
                rel='noopener noreferrer'
                className={s.corsLink}
            >
                website
            </a> and request the access.
        </div>
    )
}
