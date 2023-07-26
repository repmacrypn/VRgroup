import React, { useState, useEffect, useContext } from 'react'
import { Briefcase, BuildingSkyscraper, ChevronDown, MapPin, Search } from 'tabler-icons-react'
import { Button, Select, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import s from './FilterPage.module.css'
import {
    addRecentSearch, clearCustomers, /* fetchCountries, fetchIndustries, */
    findCustomers, status, setIsVisible, setPageNumber, showPopUp,
    selectIsShortInfoVisible, setFilterData,
} from '../../redux/filterSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { FilterContext } from '../../context/contexts'
import { filterAPI } from '../../api/api'

export const FilterField = ({ classN, isPopUpVis }) => {
    const { data: industries = [] } = useQuery({
        queryKey: ['industries'],
        queryFn: filterAPI.fetchIndustries,
        staleTime: Infinity,
    })

    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: filterAPI.fetchCountries,
        staleTime: Infinity,
    })

    const dispatch = useDispatch()
    const isClear = useSelector(state => state.filter.isFiltersClear)

    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState('')
    const [selectIndValue, setSelectIndValue] = useState('')

    const mapFetchedFilterData = (fetchedArr) => {
        return fetchedArr.map((prop) => ({ value: prop.id, label: prop.name }))
    }

    useEffect(() => {
        return () => {
            dispatch(clearCustomers())
            dispatch(setFilterData({ searchValue: '', selectLocValue: '', selectIndValue: '' }))
        }
    }, [dispatch])

    useEffect(() => {
        setSearchValue('')
        setSelectLocValue('')
        setSelectIndValue('')
    }, [isClear])

    return (
        <div className={`${s.filterField} ${s[classN]}`}>
            <div className={s.filterDataWrapper}>
                <div className={s.curDataWrap}>
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
                </div>
                <div className={s.curDataWrap}>
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
                </div>
                <div className={s.curDataWrap}>
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
                </div>
            </div>
            <FilterButton
                isPopUpVis={isPopUpVis}
                searchValue={searchValue}
                selectLocValue={selectLocValue}
                selectIndValue={selectIndValue}
                countries={countries}
                industries={industries}
            />
        </div>
    )
}

FilterField.propTypes = {
    classN: PropTypes.string,
    isPopUpVis: PropTypes.bool,
}

const FilterButton = ({ searchValue, selectLocValue,
    selectIndValue, countries, industries, isPopUpVis }) => {

    const dispatch = useDispatch()
    const isLoading = useSelector(status)
    const itemsPerPage = useContext(FilterContext)
    const isShortInfoVisible = useSelector(selectIsShortInfoVisible)

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
        if (isShortInfoVisible) dispatch(setIsVisible(false))
    }

    return (
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
    )
}

FilterButton.propTypes = {
    searchValue: PropTypes.string,
    selectLocValue: PropTypes.string,
    selectIndValue: PropTypes.string,
    countries: PropTypes.array,
    industries: PropTypes.array,
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

export const FilterLabel = React.memo(({ children, text }) => {
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

export const FilterBurger = ({ isVisible, setIsVisible }) => {
    return (
        <div className={`bold600 ${s.filtersTitle}`}>
            <div>
                Filters
            </div>
            <div
                className={`${s.burgerContainer} ${s[`change${isVisible}`]}`}
                onClick={() => setIsVisible(value => !value)}
            >
                <div className={s.bar1}></div>
                <div className={s.bar2}></div>
                <div className={s.bar3}></div>
            </div>
        </div>
    )
}

FilterBurger.propTypes = {
    isVisible: PropTypes.bool,
    setIsVisible: PropTypes.func,
}