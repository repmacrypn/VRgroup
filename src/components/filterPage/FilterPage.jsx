import React, { useState, useEffect } from "react";
import s from './FilterPage.module.css'
/* import dropDown from '../../../resources/images/dropDown.png';
import dropDownOnFocus from '../../../resources/images/dropDownOnFocus.png'; */
import { Input, Select } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchIndustries, findCustomers } from "../../redux/filterSlice";
/* import { ms } from '../../../styles/mantineStyles'; */

const FilterPage = React.memo(() => {
    const countries = useSelector(state => state.filter.countries)
    const industries = useSelector(state => state.filter.industries)
    const customers = useSelector(state => state.filter.customers)

    const dispatch = useDispatch()

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

    const fetchedCustomers = customers.map(uno => {
        return <div key={uno.id}>
            <div>get Full Name</div>
            <div>{uno.job_title}</div>
            <div>{uno.industry}</div>
            <div>{uno.country}</div>
            <br></br>
        </div>
    })

    const qq = () => {
        dispatch(findCustomers({ searchValue, selectLocValue, selectIndValue }))
    }

    return (
        <div className={s.filterField}>
            <Input
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
            <Select
                value={selectLocValue}
                onChange={setSelectLocValue}
                maxDropdownHeight={188}
                data={mapFetchedFilterData(countries)}
                placeholder="Choose location"
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
            <Select
                value={selectIndValue}
                onChange={setSelectIndValue}
                maxDropdownHeight={188}
                data={mapFetchedFilterData(industries)}
                placeholder="Choose industry"
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
            <button onClick={qq}> qq </button>
            <div>{fetchedCustomers}</div>
        </div>
    )
})

export default FilterPage
