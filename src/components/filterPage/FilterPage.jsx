import React, { useState, useEffect } from "react";
import s from './FilterPage.module.css'
/* import dropDown from '../../../resources/images/dropDown.png';
import dropDownOnFocus from '../../../resources/images/dropDownOnFocus.png'; */
import { Input, Select } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchIndustries, findCustomers, selectItemsPerPage, selectTotalCount } from "../../redux/filterSlice";
import ReactPaginate from "react-paginate";
/* import { selectIsAuth } from "../../redux/authSlice";
import { Navigate } from "react-router-dom"; */
/* import { ms } from '../../../styles/mantineStyles'; */

const FilterPage = React.memo(() => {
    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const customers = useSelector(state => state.filter.customers)
    const itemsPerPage = useSelector(selectItemsPerPage)
    const totalCount = useSelector(selectTotalCount)
    /* const isAuth = useSelector(selectIsAuth) */

    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState('')
    const [selectIndValue, setSelectIndValue] = useState('')

    const pageCount = Math.ceil(totalCount / itemsPerPage)

    useEffect(() => {
        dispatch(fetchCountries())
        dispatch(fetchIndustries())
    }, [dispatch])

    const mapFetchedFilterData = (fetchedArr) => {
        return fetchedArr.map((prop) => ({ value: prop.id, label: prop.name }))
    }

    const fetchedCustomers = customers.map(uno => {
        return <div key={uno.id}>
            <div>get Full Name</div>
            <div>{uno.job_title}</div>
            <div>{uno.industry}</div>
            <div>{uno.country}</div>
            <br></br>
        </div>
    })

    const fetchCustomersOnBlur = () => {
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: 0, to: 0 + itemsPerPage }))
    }

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount;
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue, from: newOffset, to: newOffset + itemsPerPage }))
    }

    /* if (!isAuth) return <Navigate to='/loginPage' /> */

    return (
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
            <div>{fetchedCustomers}</div>
            <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
            />
        </div>
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

export default FilterPage
