import { useEffect, useRef, useCallback, useContext } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { SquareArrowDown } from 'tabler-icons-react'
import s from './FilterPage.module.css'
import { UserShortInfo } from './ShortInfo'
import { Pagination } from './Pagination'
import { GreetingsState } from './Greetings'
import {
    getUserName, status, selectUserName, setCurrentUser,
    setIsVisible, selectIsShortInfoVisible,
} from '../../redux/filterSlice'
import { EmptyState } from '../common components/emptyState/EmptyState'
import Preloader from '../common components/preloader/Preloader'
import '../../styles/fonts.css'
import { UserNameContext } from '../../context/contexts'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { StatusType } from '../../models/common/status.type'
import { ITotalCount } from '../../models/common/total.interface'
import { ICustomer } from '../../models/common/customer.interface'

export const UserTable = ({ totalCount }: ITotalCount) => {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const isLoading: StatusType = useAppSelector(status)
    const isShortInfoVisible: boolean = useAppSelector(selectIsShortInfoVisible)

    const getUserNameOnClick = useCallback((e: React.MouseEvent<HTMLElement>, userId: string) => {
        e.stopPropagation()
        dispatch(getUserName(userId))
    }, [dispatch])

    const handleOutsideClick = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef?.current?.contains(e.target as Node) && isShortInfoVisible) {
            dispatch(setIsVisible(false))
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    })

    if (totalCount === null) return <GreetingsState />
    if (isLoading === 'loading') return <Preloader />
    if (totalCount === 0) return <EmptyState />

    return (
        <>
            <div ref={wrapperRef}>
                <UserNameContext.Provider value={getUserNameOnClick}>
                    {isShortInfoVisible && <UserShortInfo />}
                    <UserTableData />
                </UserNameContext.Provider>
            </div>
            <Pagination
                totalCount={totalCount}
            />
        </>
    )
}

interface ITableHeading {
    name: string;
    id: string;
}

const UserTableData = () => {
    const customers: ICustomer[] = useAppSelector(state => state.filter.customers)
    const fetchedCustomers = customers.map((user: ICustomer) => {
        return (
            <UserTableInfo
                key={user.id}
                user={user}
            />
        )
    })

    const tableHeadings: ITableHeading[] = [
        { name: 'Full name', id: nanoid() },
        { name: 'Job title', id: nanoid() },
        { name: 'Industry', id: nanoid() },
        { name: 'Location', id: nanoid() },
    ]

    const completedHeadings = tableHeadings.map((header: ITableHeading) => (
        <th
            className={`${s.tableHeaderTitle}`}
            key={header.id}
        >
            {header.name}
            <SquareArrowDown
                className={s.icon}
                viewBox="0 -5 24 24"
                height={16}
                width={26}
            />
        </th>
    ))

    return (
        <table className={s.usersTable}>
            <thead>
                <tr className={s.tableHeaderRow}>
                    {completedHeadings}
                </tr>
            </thead>
            <tbody>
                {fetchedCustomers}
            </tbody>
        </table>
    )
}

const UserTableInfo = ({ user }: { user: ICustomer }) => {
    const dispatch = useAppDispatch()
    const isShortInfoVisible: boolean = useAppSelector(selectIsShortInfoVisible)
    const name: string | undefined = useAppSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(UserNameContext)

    const getUserShortInfo = () => {
        dispatch(setCurrentUser(user))
        if (!isShortInfoVisible) dispatch(setIsVisible(true))
    }

    let resultName

    name ?
        resultName = <div>{name}</div> :
        resultName = (
            <button
                className={`${s.tableAccessNameButton} bold500`}
                onClick={(e) => getUserNameOnClick!(e, user.id)}>
                <div className={`${s.buttonPar} bold500`}>
                    <div className={s.iconWrapper}>
                        <div className={s.userIcon}></div>
                        <div className={s.verifyIcon}></div>
                    </div>
                    Get the name
                </div>
            </button>
        )

    return (
        <tr
            className={s.userTableRow}
            onClick={getUserShortInfo}
        >
            <td data-th='Full name:'>{resultName}</td>
            <td data-th='Job title:'>{user.job_title}</td>
            <td data-th='Industry:'>{user.industry}</td>
            <td data-th='Location:'>{user.country}</td>
        </tr>
    )
}