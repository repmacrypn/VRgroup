import React, { useState, useEffect, useRef, useCallback } from "react"
import s from './FilterPage.module.css'
/* import dropDown from '../../../resources/images/dropDown.png';
import dropDownOnFocus from '../../../resources/images/dropDownOnFocus.png'; */
import { Button, Select, TextInput } from '@mantine/core'
import { Briefcase, BuildingSkyscraper, ChevronDown, MapPin, Search } from 'tabler-icons-react'
import { useDispatch, useSelector } from "react-redux"
import { fetchCountries, fetchIndustries, findCustomers, getUserName, selectItemsPerPage, selectTotalCount, showPopUp } from "../../redux/filterSlice"
import ReactPaginate from "react-paginate"
import { EmptyState } from "../common components/emptyState/EmptyState"
import Preloader from "../common components/preloader/Preloader"
import { Navigate } from "react-router-dom"
import { selectIsAuth } from "../../redux/authSlice"
import '../../styles/fonts.css'
/* import { selectIsAuth } from "../../redux/authSlice";*/
import { ms } from '../../styles/mantineStyles';

export const FilterContext = React.createContext()

const FilterPage = React.memo(() => {
    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const isPopUpVis = useSelector(state => state.filter.isPopUpVisible)
    const status = useSelector(state => state.filter.status)
    const userData = useSelector(selectIsAuth)
    const totalCount = useSelector(selectTotalCount)
    const itemsPerPage = useSelector(selectItemsPerPage)
    const dispatch = useDispatch()

    const [pageNumber, setPageNumber] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState('')
    const [selectIndValue, setSelectIndValue] = useState('')

    useEffect(() => {
        dispatch(fetchCountries())
        dispatch(fetchIndustries())
    }, [dispatch])

    const mapFetchedFilterData = (fetchedArr) => {
        return fetchedArr.map((prop) => ({ value: prop.id, label: prop.name }))
    }

    const fetchCustomersOnClick = () => {
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: 0, to: 0 + itemsPerPage }))
        setPageNumber(0)
    }

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount;
        if (newOffset >= 60) dispatch(showPopUp())
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: newOffset, to: newOffset + itemsPerPage }))
        setPageNumber(e.selected);
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
                        <div className={s.filterField}>
                            <FilterLabel text='Job title'>
                                <Briefcase size={14} />
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
                                <MapPin size={14} />
                            </FilterLabel>
                            <FilterPageSelect
                                value={selectLocValue}
                                setValue={setSelectLocValue}
                                processArr={mapFetchedFilterData}
                                array={countries}
                                text='Choose location'
                            />
                            <FilterLabel text='Industry'>
                                <BuildingSkyscraper size={14} />
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
                                    root: Object.assign({}, ms.button.defaultRoot, ms.button.filterRoot)
                                }}
                            >
                                Find customers
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`bold700 ${s.filterTotalField}`}>
                        <span>Total </span>
                        <span className={`bold600 ${s.filterTotalNum}`}>{totalCount || 0}</span>
                    </div>
                    {
                        isPopUpVis ||
                        <UserTable
                            status={status}
                            itemsPerPage={itemsPerPage}
                            handlePageChange={handlePageChange}
                            totalCount={totalCount}
                            pageNumber={pageNumber}
                        />
                    }
                    {isPopUpVis && <UpgragePopUp />}
                </div>
            </div>
        </FilterContext.Provider>
    )
})

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
                wrapper: ms.select.wrapper
            }}
        />
    )
}

const UpgragePopUp = () => {
    return <div className={s.popUpVisible}>
        UPGRADE
    </div>
}

const UserTable = ({ itemsPerPage, handlePageChange,
    totalCount, pageNumber, status }) => {

    const customers = useSelector(state => state.filter.customers)
    const pageCount = Math.ceil(totalCount / itemsPerPage)

    const fetchedCustomers = customers.map(user => {
        return <UserTableInfo key={user.id} user={user} />
    })

    if (totalCount === null) return <div>Main filter</div>
    if (status === 'loading') return <Preloader />
    if (totalCount === '0') return <EmptyState />

    console.log('qq table')

    return (
        <>
            <div>{fetchedCustomers}</div>
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

const UserTableInfo = ({ user }) => {
    const wrapperRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    const dispatch = useDispatch()
    const usersFullNameArray = useSelector(state => state.filter.usersFullNameArray)

    const getCurUserName = useCallback((id) => {
        return usersFullNameArray.find(obj => obj.userId === id)?.userName
    }, [usersFullNameArray])

    const getUserNameOnClick = useCallback((e, userId) => {
        e.stopPropagation()
        dispatch(getUserName(userId))
    }, [dispatch])

    const handleOutsideClick = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setIsVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    })
    console.log('parent')

    return (
        <div ref={wrapperRef}>
            <div onClick={() => setIsVisible(true)}>
                <button
                    disabled={getCurUserName(user.id)}
                    onClick={(e) => getUserNameOnClick(e, user.id)}>
                    {getCurUserName(user.id) || 'get Full Name'}
                </button>
                <div>{user.job_title}</div>
                <div>{user.industry}</div>
                <div>{user.country}</div>
                <br></br>
            </div>
            <UserShortInfo
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                user={user}
                getCurUserName={getCurUserName}
                getUserNameOnClick={getUserNameOnClick}
            />
        </div>
    )
}

const UserShortInfo = ({ user, isVisible, setIsVisible, getCurUserName, getUserNameOnClick }) => {
    console.log('child')
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

const FilterLabel = ({ children, text }) => {
    return (
        <div className={`${s.filterLabelWrapper}`}>
            {children}
            {' '}
            <span className={`bold500 ${s.filterLabel}`}>{text}</span>
        </div>
    )
}

export default FilterPage
