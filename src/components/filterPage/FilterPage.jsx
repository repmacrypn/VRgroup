import React, { useState, useEffect, useRef, useCallback } from 'react'
import s from './FilterPage.module.css'
import { Button, Select, TextInput } from '@mantine/core'
import {
    Briefcase, BuildingSkyscraper, ChevronDown,
    History, MapPin, Search, SquareArrowDown,
} from 'tabler-icons-react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
    addRecentSearch, clearCustomers, fetchCountries, fetchIndustries,
    findCustomers, getUserName, selectItemsPerPage, selectTotalCount, showPopUp,
} from '../../redux/filterSlice'
import ReactPaginate from 'react-paginate'
import { EmptyState } from '../common components/emptyState/EmptyState'
import Preloader from '../common components/preloader/Preloader'
import { NavLink, Navigate } from 'react-router-dom'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
/* import { selectIsAuth } from "../../redux/authSlice";*/
import { ms } from '../../styles/mantineStyles'
import popUpIcon from '../../assets/images/popUpIcon.svg'
import { nanoid } from '@reduxjs/toolkit'

export const FilterContext = React.createContext()

//перенести работу с локальным стейтом в нужный компонент

const FilterPage = React.memo(() => {
    const isPopUpVis = useSelector(state => state.filter.isPopUpVisible)
    const userData = useSelector(selectIsAuth)
    const totalCount = useSelector(selectTotalCount)
    const itemsPerPage = useSelector(selectItemsPerPage)
    const dispatch = useDispatch()

    const [pageNumber, setPageNumber] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState('')
    const [selectIndValue, setSelectIndValue] = useState('')

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount
        if (newOffset >= 60) {
            dispatch(showPopUp(true))
        } else {
            dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: newOffset, to: newOffset + itemsPerPage }))
        }
        setPageNumber(e.selected)
    }

    if (!userData) return <Navigate to='/loginPage' />

    return (
        <FilterContext.Provider
            value={{ setSearchValue, setSelectLocValue, setSelectIndValue }}
        >
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
                            setPageNumber={setPageNumber}
                            itemsPerPage={itemsPerPage}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            selectLocValue={selectLocValue}
                            setSelectLocValue={setSelectLocValue}
                            selectIndValue={selectIndValue}
                            setSelectIndValue={setSelectIndValue}
                        />
                    </div>
                </div>
                <div className={s.filterResultWrapper}>
                    <div className={`bold700 ${s.filterTotalField}`}>
                        <span className={s.totalTitle}>
                            Total
                        </span>
                        <span className={`${s.filterTotalNum}`}>
                            {totalCount || 0}
                        </span>
                    </div>
                    {
                        isPopUpVis ||
                        <UserTable
                            itemsPerPage={itemsPerPage}
                            handlePageChange={handlePageChange}
                            totalCount={totalCount}
                            pageNumber={pageNumber}
                        />
                    }
                    {
                        isPopUpVis &&
                        <UpgragePopUp
                            showPopUp={showPopUp}
                            setPageNumber={setPageNumber}
                            itemsPerPage={itemsPerPage}
                        />
                    }
                </div>
            </div>
        </FilterContext.Provider>
    )
})

const FilterField = React.memo(({ searchValue, setSearchValue, selectLocValue, setPageNumber,
    setSelectLocValue, selectIndValue, setSelectIndValue, itemsPerPage, isPopUpVis }) => {

    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const status = useSelector(state => state.filter.status)

    const dispatch = useDispatch()

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
        if (isPopUpVis) dispatch(showPopUp(false))
        setPageNumber(0)
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
        if (!industries.length) {
            dispatch(fetchIndustries())
        }
    }, [dispatch, countries.length, industries.length])

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
                disabled={status === 'loading'}
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
})

FilterField.propTypes = {
    searchValue: PropTypes.string,
    setSearchValue: PropTypes.func,
    setPageNumber: PropTypes.func,
    setSelectLocValue: PropTypes.func,
    setSelectIndValue: PropTypes.func,
    itemsPerPage: PropTypes.number,
    isPopUpVis: PropTypes.bool,
    selectIndValue: PropTypes.string,
    selectLocValue: PropTypes.string,
}

const FilterPageSelect = ({ value, setValue, processArr, array, text }) => {
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
}

FilterPageSelect.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    processArr: PropTypes.func,
    array: PropTypes.array,
    text: PropTypes.string,
}

const UpgragePopUp = ({ showPopUp, setPageNumber, itemsPerPage }) => {
    const dispatch = useDispatch()
    const onDismissClick = () => {
        dispatch(showPopUp(false))
        setPageNumber(Math.ceil(60 / itemsPerPage - 1))
    }

    return <div className={s.popUpVisible}>
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
}

UpgragePopUp.propTypes = {
    showPopUp: PropTypes.func,
    setPageNumber: PropTypes.func,
    itemsPerPage: PropTypes.number,
}

const UserTable = ({ itemsPerPage, handlePageChange,
    totalCount, pageNumber }) => {

    //закинуть useRef на айтемсперпэйдж и передать в рисент компоненту

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

    const customers = useSelector(state => state.filter.customers)
    const pageCount = Math.ceil(totalCount / itemsPerPage)
    const status = useSelector(state => state.filter.status)

    const fetchedCustomers = customers.map(user => {
        return <UserTableInfo key={user.id} user={user} />
    })

    if (totalCount === null) return <GreetingsState />
    if (status === 'loading') return <Preloader />
    if (totalCount === '0') return <EmptyState />

    return (
        <>
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
            <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                activeClassName={s.active}
                forcePage={pageNumber}
            />
        </>
    )
}

UserTable.propTypes = {
    handlePageChange: PropTypes.func,
    totalCount: PropTypes.string,
    pageNumber: PropTypes.number,
    itemsPerPage: PropTypes.number,
}

const UserTableInfo = ({ user }) => {
    const wrapperRef = useRef(null)
    /* const [isVisible, setIsVisible] = useState(false) */

    const dispatch = useDispatch()
    const usersFullNameArray = useSelector(state => state.filter.usersFullNameArray)

    const getCurUserName = useCallback((id) => {
        return usersFullNameArray.find(obj => obj.userId === id)?.userName
    }, [usersFullNameArray])

    const getUserNameOnClick = useCallback((e, userId) => {
        e.stopPropagation()
        dispatch(getUserName(userId))
    }, [dispatch])

    /* const handleOutsideClick = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setIsVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }) */

    return (
        <>
            <tr
                //вот здесь вместо банального сетания будем делать диспатч нужного юзера (shortTableInfo)
                /* onClick={() => setIsVisible(true)} */
                ref={wrapperRef}
            >
                <td>
                    <button
                        className={`${s.tableAccessNameButton} bold500`}
                        disabled={getCurUserName(user.id)}
                        onClick={(e) => getUserNameOnClick(e, user.id)}>
                        <div className={`${s.buttonPar} bold500`}>
                            <div className={s.verifyIcon}></div>
                            {getCurUserName(user.id) || 'Get the name'}
                        </div>
                    </button>
                </td>
                <td>{user.job_title}</td>
                <td>{user.industry}</td>
                <td>{user.country}</td>
            </tr>
        </>
    )
}

UserTableInfo.propTypes = {
    user: PropTypes.object,
}

{/* < UserShortInfo
    setIsVisible={setIsVisible}
    isVisible={isVisible}
    user={user}
    getCurUserName={getCurUserName}
    getUserNameOnClick={getUserNameOnClick}
/> */}

/* const UserShortInfo = ({ user, isVisible, setIsVisible, getCurUserName, getUserNameOnClick }) => {
    return (
        <div className={`${s[`userShortInfo${isVisible}`]}`}>
            <button
                disabled={getCurUserName(user.id)}
                onClick={(e) => getUserNameOnClick(e, user.id)}>
                {getCurUserName(user.id) || 'get Full Name'}
            </button>
            <div>{user.job_title}</div>
            <div>{user.industry}</div>
            <div>{user.country}</div>
            <div>{user.description}</div>
            <div onClick={() => setIsVisible(false)}>X</div>
        </div>
    )
}

UserShortInfo.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        job_title: PropTypes.string.isRequired,
        industry: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }),
    isVisible: PropTypes.bool,
    setIsVisible: PropTypes.func,
    getCurUserName: PropTypes.func,
    getUserNameOnClick: PropTypes.func,
} */

const FilterLabel = ({ children, text }) => {
    return (
        <div className={`${s.filterLabelWrapper}`}>
            {children}
            <span className={`bold500 ${s.filterLabel}`}>{text}</span>
        </div>
    )
}

FilterLabel.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string,
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

    const resentResultArray = recentSearchArray.map((searchData) => (<RecentItem key={searchData.id} searchData={searchData} />))

    return (
        <div className={s.recentSearchBorder}>
            {
                recentSearchArray.length ?
                    resentResultArray :
                    <div className={`${s.recentSearches} bold500`}>
                        Your last four searches will be here for quick access
                    </div>
            }
        </div>
    )
}

const RecentItem = ({ searchData, itemsPerPage = 12 }) => {
    const status = useSelector(state => state.filter.status)
    const dispatch = useDispatch()

    const getCustomersOnClick = () => {
        dispatch(findCustomers({
            searchValue: searchData.searchValue, selectLocValue: searchData.locIndex,
            selectIndValue: searchData.indIndex, from: 0, to: 0 + itemsPerPage,
        }))
    }

    return (
        <button
            onClick={getCustomersOnClick}
            disabled={status === 'loading'}
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
    itemsPerPage: PropTypes.number,
}

FilterPage.displayName = 'FilterPage'
FilterField.displayName = 'FilterField'

export default FilterPage
