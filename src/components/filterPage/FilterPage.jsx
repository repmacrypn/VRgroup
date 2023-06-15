import React, { useState, useEffect, useRef, useCallback } from "react";
import s from './FilterPage.module.css'
/* import dropDown from '../../../resources/images/dropDown.png';
import dropDownOnFocus from '../../../resources/images/dropDownOnFocus.png'; */
import { Input, Select } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchIndustries, findCustomers, getUserName, selectItemsPerPage, selectTotalCount, showPopUp } from "../../redux/filterSlice";
import ReactPaginate from "react-paginate";
import { EmptyState } from "../common components/emptyState/EmptyState";
import Preloader from "../common components/preloader/Preloader";
/* import { selectIsAuth } from "../../redux/authSlice";
import { Navigate } from "react-router-dom"; */
/* import { ms } from '../../../styles/mantineStyles'; */

export const FilterContext = React.createContext()

const FilterPage = React.memo(() => {
    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const isPopUpVis = useSelector(state => state.filter.isPopUpVisible)
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

    const fetchCustomersOnBlur = () => {
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: 0, to: 0 + itemsPerPage }))
        setPageNumber(0)
    }

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount;
        if (newOffset >= 60) dispatch(showPopUp())
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: newOffset, to: newOffset + itemsPerPage }))
        setPageNumber(e.selected);
    }

    return (
        <FilterContext.Provider
            value={{ setSearchValue, setSelectLocValue, setSelectIndValue }}
        >
            <div>
                total {totalCount || 0}
            </div>
            <div className={s.filterField}>
                <Input
                    onBlur={fetchCustomersOnBlur}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    icon={<Search size={16} />}
                    iconWidth={30}
                    placeholder="Search by job title"
                    radius="md"
                /* styles={{
                    input: ms.textInput.input,
                }} */
                />
                <FilterPageSelect
                    handleBlur={fetchCustomersOnBlur}
                    value={selectLocValue}
                    setValue={setSelectLocValue}
                    processArr={mapFetchedFilterData}
                    array={countries}
                    text='Choose location'
                />
                <FilterPageSelect
                    handleBlur={fetchCustomersOnBlur}
                    value={selectIndValue}
                    setValue={setSelectIndValue}
                    processArr={mapFetchedFilterData}
                    array={industries}
                    text='Choose industry'
                />
                {
                    isPopUpVis ||
                    <UserTable
                        itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}
                        totalCount={totalCount}
                        pageNumber={pageNumber}
                    />
                }
                {isPopUpVis && <UpgragePopUp />}
            </div>
        </FilterContext.Provider>
    )
})

const FilterPageSelect = ({ handleBlur, value, setValue, processArr, array, text }) => {
    return (
        <Select
            onBlur={handleBlur}
            value={value}
            onChange={setValue}
            maxDropdownHeight={188}
            data={processArr(array)}
            placeholder={text}
            radius="md"
        /* rightSectionWidth={40}
        rightSection={}
        onDropdownClose={() => setFocused(false)}
        onDropdownOpen={() => setFocused(true)}
        styles={{
            input: ms.select.input,
            dropdown: ms.select.dropdown,
            item: ms.select.item,
            rightSection: ms.select.rightSection,
        }} */
        />
    )
}

const UpgragePopUp = () => {
    return <div className={s.popUpVisible}>
        UPGRADE
    </div>
}

const UserTable = ({ itemsPerPage, handlePageChange,
    totalCount, pageNumber }) => {

    const status = useSelector(state => state.filter.status)
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

export default FilterPage
