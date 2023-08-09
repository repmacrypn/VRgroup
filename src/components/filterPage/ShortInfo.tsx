import React, { useContext } from 'react'
import { UserCircle, X } from 'tabler-icons-react'
import { Button } from '@mantine/core'
import s from './FilterPage.module.css'
import '../../styles/fonts.css'
import { selectUserName, setIsVisible } from '../../redux/filterSlice'
import { ms } from '../../styles/mantineStyles'
import { UserNameContext } from '../../context/contexts'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { ICustomer } from '../../models/common/customer.interface'
import { IDataProps } from '../../models/common/textValueProps.interface'

export const UserShortInfo = () => {
    const user: ICustomer = useAppSelector(state => state.filter.currentUser)
    let name: string | undefined = useAppSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(UserNameContext)

    let resultName: JSX.Element
    name ?
        resultName = (
            <div className={`${s.userShortInfoName} bold700`}>
                {name}
            </div>
        ) :
        resultName = (
            <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => getUserNameOnClick!(e, user.id)}
                radius='md'
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.shortInfoRoot),
                }}
            >
                <UserCircle
                    className={s.icon}
                    viewBox="0 -1 24 24"
                    height={18}
                    width={28}
                />
                Get access to name
            </Button>
        )

    return (
        <div className={s.userShortInfoWrapper}>
            <div className={s.userShortInfo}>
                {resultName}
                <div className={`${s.userInfo} regular400`}>
                    <UserShortData
                        text='Job title'
                        value={user.job_title}
                    />
                    <UserShortData
                        text='Industry'
                        value={user.industry}
                    />
                    <UserShortData
                        text='Location'
                        value={user.country}
                    />
                    <UserShortData
                        text='Description'
                        value={user.description}
                    />
                </div>
            </div>
            <CloseButton />
        </div>
    )
}

const CloseButton = React.memo(() => {
    const dispatch = useAppDispatch()

    const closeOnClick = (): void => {
        dispatch(setIsVisible(false))
    }

    return (
        <div
            className={s.closeButton}
            onClick={closeOnClick}>
            <X
                className={s.icon}
                color='#3626A7'
                viewBox="-11 -7 24 24"
                height={16}
                width={16}
            />
        </div>
    )
})

const UserShortData = React.memo(({ text, value }: IDataProps) => {
    return (
        <div>
            <div className={s.userInfoTitle}>
                {text}
            </div>
            <div>
                {value}
            </div>
        </div>
    )
})

