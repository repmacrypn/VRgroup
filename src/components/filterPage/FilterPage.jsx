import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import {
    Briefcase, BuildingSkyscraper, ChevronDown, ChevronLeft, ChevronRight,
    History, MapPin, Search, SquareArrowDown, UserCircle, X,
} from 'tabler-icons-react'
import { Button, Select, TextInput } from '@mantine/core'
import PropTypes from 'prop-types'
import { NavLink, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'
import s from './FilterPage.module.css'
import {
    addRecentSearch, clearCustomers, fetchCountries, fetchIndustries,
    findCustomers, getUserName, status, selectUserName, setCurrentUser,
    setFilterData, setIsVisible, setPageNumber, showPopUp,
} from '../../redux/filterSlice'
import { EmptyState } from '../common components/emptyState/EmptyState'
import Preloader from '../common components/preloader/Preloader'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import popUpIcon from '../../assets/images/popUpIcon.svg'

//если будет не лень то поразделяй компоненту фильтра на отдельные части (баттон инпуты и тп чтобы состояние лоадинга не меняло всю комп-ту)
//пофиксить филтер филд при срабатывании попапа и др (чтобы он брал дефолтное состоянние из стейта)
// также нужно будет сделать хрень чтоб при выходе из компоненты данные из стейта тоже обновлялись (я про филтер филд)
export const FilterContext = React.createContext(null)

const FilterPage = () => {
    const isAuth = useSelector(selectIsAuth)
    const isPopUpVis = useSelector(state => state.filter.isPopUpVisible)
    const itemsPerPage = useSelector(state => state.filter.itemsPerPage)

    if (!isAuth) return <Navigate to='/loginPage' />

    return (
        <div className={`defaultFontS ${s.filterPageWrapper}`}>
            <div className={s.filterFieldWrapper}>
                <div className={`bold900 ${s.logoTitle}`}>
                    VRgroup
                </div>
                <div>
                    <div className={`bold600 ${s.filtersTitle}`}>
                        Filters
                    </div>
                    <FilterField
                        isPopUpVis={isPopUpVis}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
            <FilterContext.Provider value={itemsPerPage}>
                <ResultData isPopUpVis={isPopUpVis} />
            </FilterContext.Provider>
        </div>
    )
}

const ResultData = ({ isPopUpVis }) => {
    const totalCount = useSelector(state => state.filter.totalCount)

    return (
        <div className={s.filterResultWrapper}>
            <Total totalCount={totalCount} />
            {
                isPopUpVis ||
                <UserTable
                    totalCount={totalCount}
                />
            }
            {
                isPopUpVis &&
                <UpgragePopUp />
            }
        </div>
    )
}

ResultData.propTypes = {
    isPopUpVis: PropTypes.bool,
}

const Total = ({ totalCount }) => {

    return (
        <div className={`bold700 ${s.filterTotalField}`}>
            <span className={s.totalTitle}>
                Total
            </span>
            <span className={`${s.filterTotalNum}`}>
                {totalCount || 0}
            </span>
        </div>
    )
}

Total.propTypes = {
    totalCount: PropTypes.string,
}

const FilterField = ({ itemsPerPage, isPopUpVis }) => {

    const dispatch = useDispatch()
    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const isLoading = useSelector(status)

    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState('')
    const [selectIndValue, setSelectIndValue] = useState('')

    const mapFetchedFilterData = (fetchedArr) => {
        return fetchedArr.map((prop) => ({ value: prop.id, label: prop.name }))
    }

    const fetchCustomersOnClick = () => {
        dispatch(findCustomers({
            searchValue, selectLocValue, selectIndValue,
            from: 0, to: 0 + itemsPerPage,
        }))
        dispatch(addRecentSearch({
            searchValue, locIndex: selectLocValue, selectLocValue: countries[selectLocValue - 1]?.name,
            indIndex: selectIndValue, selectIndValue: industries[selectIndValue - 1]?.name,
        }))
        dispatch(setFilterData({ searchValue, selectLocValue, selectIndValue }))
        dispatch(setPageNumber(0))
        if (isPopUpVis) dispatch(showPopUp(false))
    }

    useEffect(() => {
        return () => {
            dispatch(clearCustomers())
        }
    }, [dispatch])

    useEffect(() => {
        if (!countries.length) {
            dispatch(fetchCountries())
        }
    }, [dispatch, countries.length])

    useEffect(() => {
        if (!industries.length) {
            dispatch(fetchIndustries())
        }
    }, [dispatch, industries.length])

    return (
        <div className={s.filterField}>
            <FilterLabel text='Job title'>
                <Briefcase viewBox="0 -2 24 24" height={14} width={26} />
            </FilterLabel>
            <TextInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                icon={<Search color="black" size={16} />}
                iconWidth={30}
                placeholder="Search by job title"
                radius="md"
                styles={{
                    wrapper: ms.textInput.wrapper,
                    icon: ms.textInput.icon,
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.filterInput),
                }}
            />
            <FilterLabel text='Location'>
                <MapPin viewBox="0 -1 24 24" height={14} width={26} />
            </FilterLabel>
            <FilterPageSelect
                value={selectLocValue}
                setValue={setSelectLocValue}
                processArr={mapFetchedFilterData}
                array={countries}
                text='Choose location'
            />
            <FilterLabel text='Industry'>
                <BuildingSkyscraper viewBox="0 -1 24 24" height={14} width={26} />
            </FilterLabel>
            <FilterPageSelect
                value={selectIndValue}
                setValue={setSelectIndValue}
                processArr={mapFetchedFilterData}
                array={industries}
                text='Choose industry'
            />
            <Button
                onClick={fetchCustomersOnClick}
                disabled={isLoading === 'loading'}
                radius='md'
                type="submit"
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.filterRoot),
                }}
            >
                Find customers
            </Button>
        </div>
    )
}

FilterField.propTypes = {
    itemsPerPage: PropTypes.number,
    isPopUpVis: PropTypes.bool,
}

const FilterPageSelect = React.memo(({ value, setValue, processArr, array, text }) => {
    return (
        <Select
            value={value}
            onChange={setValue}
            maxDropdownHeight={188}
            data={processArr(array)}
            placeholder={text}
            radius="md"
            rightSectionWidth={40}
            rightSection={<ChevronDown />}
            styles={{
                input: ms.select.input,
                dropdown: ms.select.dropdown,
                item: ms.select.item,
                rightSection: ms.select.rightSection,
                wrapper: ms.select.wrapper,
            }}
        />
    )
})

FilterPageSelect.displayName = 'FilterPageSelect'

FilterPageSelect.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    processArr: PropTypes.func,
    array: PropTypes.array,
    text: PropTypes.string,
}

const FilterLabel = React.memo(({ children, text }) => {
    return (
        <div className={`${s.filterLabelWrapper}`}>
            {children}
            <span className={`bold500 ${s.filterLabel}`}>{text}</span>
        </div>
    )
})

FilterLabel.displayName = 'FilterLabel'

FilterLabel.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string,
}

const UpgragePopUp = () => {
    const dispatch = useDispatch()
    const itemsPerPage = useContext(FilterContext)

    const onConfirmClick = () => {
        dispatch(showPopUp(false))
        dispatch(setPageNumber(0))
    }

    const onDismissClick = () => {
        dispatch(showPopUp(false))
        dispatch(setPageNumber(Math.ceil(60 / itemsPerPage - 1)))
    }

    return (
        <div className={s.popUpVisible}>
            <img
                height={56}
                width={56}
                className={s.popUpIcon}
                src={popUpIcon}
                alt='popUpIcon'
            />
            <div className={s.popupParWrapper}>
                <div className={s.popUpTitle}>
                    Upgrade now
                </div>
                <div className={`${s.popUpAbstract} regular400`}>
                    You are on limited version which allows
                    viewing up to 60 contacts. Upgrade your plan to view all pages.
                </div>
            </div>
            <div className={`${s.popUpButWrapper} bold600`}>
                <NavLink
                    onClick={onConfirmClick}
                    className={s.popUpSubButton}
                    to='/upgradeVersionPage'
                >
                    Upgrade
                </NavLink>
                <div onClick={onDismissClick} className={s.popUpDismissButton}>
                    Maybe later
                </div>
            </div>
        </div>
    )
}

const UserTable = ({ totalCount }) => {
    const wrapperRef = useRef(null)
    const dispatch = useDispatch()
    const isLoading = useSelector(status)

    const getUserNameOnClick = useCallback((e, userId) => {
        e.stopPropagation()
        dispatch(getUserName(userId))
    }, [dispatch])

    const handleOutsideClick = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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
                    <IsShortInfoNeeded />
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

const IsShortInfoNeeded = () => {
    const isVisible = useSelector(state => state.filter.isShortInfoVisible)
    return isVisible && <UserShortInfo />
}

const Pagination = ({ totalCount }) => {
    const dispatch = useDispatch()
    const filterData = useSelector(state => state.filter.filterData)

    const itemsPerPage = useContext(FilterContext)
    const pageCount = Math.ceil(totalCount / itemsPerPage)
    const pageNumber = useSelector(state => state.filter.pageNumber)

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount
        if (newOffset >= 60) {
            dispatch(showPopUp(true))
        } else {
            dispatch(findCustomers({
                searchValue: filterData.searchValue, selectLocValue: filterData.selectLocValue,
                selectIndValue: filterData.selectIndValue, from: newOffset, to: newOffset + itemsPerPage,
            }))
        }
        dispatch(setPageNumber(e.selected))
    }

    return (
        <ReactPaginate
            previousLabel={
                <ChevronLeft
                    className={s.icon}
                    viewBox="0 0 24 24"
                    height={14}
                    width={20}
                />
            }
            nextLabel={
                <ChevronRight
                    className={s.icon}
                    viewBox="-2 0 24 24"
                    height={14}
                    width={20}
                />
            }
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={4}
            onPageChange={handlePageChange}
            forcePage={pageNumber}
            containerClassName={s.pagination}
            breakClassName={s.navLi}
            previousClassName={s.navLi}
            nextClassName={s.navLi}
            pageClassName={s.navLi}
            activeLinkClassName={s.active}
            breakLinkClassName={s.navA}
            pageLinkClassName={s.navA}
            previousLinkClassName={`${s.navA} ${s.moveButton}`}
            nextLinkClassName={`${s.navA} ${s.moveButton}`}
        />
    )
}

Pagination.propTypes = {
    totalCount: PropTypes.string,
}

const UserTableInfo = ({ user }) => {
    const dispatch = useDispatch()
    let name = useSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(FilterContext)

    const getUserShortInfo = () => {
        dispatch(setCurrentUser(user))
        dispatch(setIsVisible(true))
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
            <td>{name}</td>
            <td>{user.job_title}</td>
            <td>{user.industry}</td>
            <td>{user.country}</td>
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

const UserShortInfo = () => {
    const user = useSelector(state => state.filter.currentUser)
    let name = useSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(FilterContext)

    name ?
        name = (
            <div className={`${s.userShortInfoName} bold700`}>
                {name}
            </div>
        ) :
        name = (
            <Button
                onClick={(e) => getUserNameOnClick(e, user.id)}
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
                {name}
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
    const dispatch = useDispatch()

    const closeOnClick = () => {
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

CloseButton.displayName = 'CloseButton'

const UserShortData = React.memo(({ text, value }) => {
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

UserShortData.displayName = 'UserShortData'

UserShortData.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
}

const GreetingsState = () => {
    return (
        <div className={s.greetStWrapper}>
            <div className={`${s.filtersTip} bold500`}>
                Add filters to begin your search
            </div>
            <div className={s.greetsEmptyState}>
                Start your people search by applying
                any filter in the left panel
            </div>
            <div className={s.recentSearchWrapper}>
                <FilterLabel text='Recent searches'>
                    <History viewBox="-16 -2 24 24" width={40} height={14} />
                </FilterLabel>
                <RecentSearches />
            </div>
        </div>
    )
}

const RecentSearches = () => {
    const recentSearchArray = useSelector(state => state.filter.recentSearchArray)
    const recentResultArray = recentSearchArray.map((searchData) => (
        <RecentItem
            key={searchData.id}
            searchData={searchData}
        />
    ))

    return (
        <div className={s.recentSearchBorder}>
            {
                recentSearchArray.length ?
                    recentResultArray :
                    <div className={`${s.recentSearches} bold500`}>
                        Your last four searches will be here for quick access
                    </div>
            }
        </div>
    )
}

const RecentItem = ({ searchData }) => {
    const dispatch = useDispatch()
    const isLoading = useSelector(status)
    const itemsPerPage = useContext(FilterContext)

    const getCustomersOnClick = () => {
        dispatch(findCustomers({
            searchValue: searchData.searchValue, selectLocValue: searchData.locIndex,
            selectIndValue: searchData.indIndex, from: 0, to: 0 + itemsPerPage,
        }))
    }

    return (
        <button
            onClick={getCustomersOnClick}
            disabled={isLoading === 'loading'}
            className={s.recentSearchData}
        >
            <Briefcase viewBox="0 -2 24 24" height={15} width={26} />
            <span>{searchData.searchValue || 'none'}</span>
            <MapPin viewBox="0 -1 24 24" height={15} width={26} />
            <span>{searchData.selectLocValue || 'none'}</span>
            <BuildingSkyscraper viewBox="0 -1 24 24" height={15} width={26} />
            <span>{searchData.selectIndValue || 'none'}</span>
        </button>
    )
}

RecentItem.propTypes = {
    searchData: PropTypes.shape({
        locIndex: PropTypes.string,
        indIndex: PropTypes.string,
        searchValue: PropTypes.string,
        selectLocValue: PropTypes.string,
        selectIndValue: PropTypes.string,
    }),
}

export default FilterPage
