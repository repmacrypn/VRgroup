import React, { useEffect, useRef, useCallback, useContext } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { SquareArrowDown } from 'tabler-icons-react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import s from './FilterPage.module.css'
import {
    getUserName, status, selectUserName, setCurrentUser,
    setIsVisible, selectIsShortInfoVisible,
} from '../../redux/filterSlice'
import { EmptyState } from '../common components/emptyState/EmptyState'
import Preloader from '../common components/preloader/Preloader'
import '../../styles/fonts.css'
import { FilterContext } from '../../context/contexts'
import { UserShortInfo } from './ShortInfo'
import { Pagination } from './Pagination'
import { GreetingsState } from './Greetings'

export const UserTable = ({ totalCount }) => {
    const wrapperRef = useRef(null)
    const dispatch = useDispatch()
    const isLoading = useSelector(status)
    const isShortInfoVisible = useSelector(selectIsShortInfoVisible)

    const getUserNameOnClick = useCallback((e, userId) => {
        e.stopPropagation()
        dispatch(getUserName(userId))
    }, [dispatch])

    const handleOutsideClick = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target) && isShortInfoVisible) {
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
    if (totalCount === '0') return <EmptyState />

    return (
        <>
            <div ref={wrapperRef}>
                <FilterContext.Provider value={getUserNameOnClick}>
                    {isShortInfoVisible && <UserShortInfo />}
                    <UserTableData />
                </FilterContext.Provider>
            </div>
            <Pagination
                totalCount={totalCount}
            />
        </>
    )
}

UserTable.propTypes = {
    totalCount: PropTypes.string,
}

const UserTableData = () => {
    const customers = useSelector(state => state.filter.customers)
    const fetchedCustomers = customers.map(user => {
        return (
            <UserTableInfo
                key={user.id}
                user={user}
            />
        )
    })

    const tableHeadings = [
        { name: 'Full name', id: nanoid() },
        { name: 'Job title', id: nanoid() },
        { name: 'Industry', id: nanoid() },
        { name: 'Location', id: nanoid() },
    ]

    const completedHeadings = tableHeadings.map(header => (
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

const UserTableInfo = ({ user }) => {
    const dispatch = useDispatch()
    const isShortInfoVisible = useSelector(selectIsShortInfoVisible)
    let name = useSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(FilterContext)

    const getUserShortInfo = () => {
        dispatch(setCurrentUser(user))
        if (!isShortInfoVisible) dispatch(setIsVisible(true))
    }

    name ?
        name = <div>{name}</div> :
        name = (
            <button
                className={`${s.tableAccessNameButton} bold500`}
                onClick={(e) => getUserNameOnClick(e, user.id)}>
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
            <td data-th='Full name:'>{name}</td>
            <td data-th='Job title:'>{user.job_title}</td>
            <td data-th='Industry:'>{user.industry}</td>
            <td data-th='Location:'>{user.country}</td>
        </tr>
    )
}

UserTableInfo.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        job_title: PropTypes.string.isRequired,
        industry: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
    }),
}