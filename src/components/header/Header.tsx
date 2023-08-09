import { Link } from 'react-router-dom'
import s from './Header.module.css'
import { selectUserData } from '../../redux/authSlice'
import { useAppSelector } from '../../hooks/useAppHooks'
import { IUserData } from '../../models/responses/login.interface'

export const Header = () => {
    const userData: IUserData | null = useAppSelector(selectUserData)
    const userAvaName: string = userData?.firstName?.slice(0, 1).toUpperCase()! + userData?.lastName?.slice(0, 1).toUpperCase()!

    return <HeaderData
        userAvaName={userAvaName}
    />
}

const HeaderData = ({ userAvaName }: { userAvaName: string }) => {
    return (
        <Link
            className={s.headerNavLink}
            to='/profilePage'
        >
            {userAvaName || 'NN'}
        </Link>
    )
}