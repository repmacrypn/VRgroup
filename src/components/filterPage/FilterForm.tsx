import React, { useState, useEffect, useContext } from 'react'
import { Briefcase, BuildingSkyscraper, ChevronDown, MapPin, Search } from 'tabler-icons-react'
import { Button, Select, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import s from './FilterPage.module.css'
import {
    addRecentSearch, clearCustomers,
    setIsVisible, setPageNumber, showPopUp,
    selectIsShortInfoVisible, setFilterData, findCustomers, status, selectIsPopUpVisible,
} from '../../redux/filterSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { FilterContext } from '../../context/contexts'
import { filterAPI } from '../../api/api'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { StatusType } from '../../models/common/status.type'
import { ICountry } from '../../models/responses/country.interface'
import { IIndustry } from '../../models/responses/industry.interface'
import { ISearchData } from '../../models/common/searchData.interface'

export const FilterField = ({ classN }: { classN: string }) => {
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

    const dispatch = useAppDispatch()
    const isClear: boolean = useAppSelector(state => state.filter.isFiltersClear)

    const [searchValue, setSearchValue] = useState('')
    const [selectLocValue, setSelectLocValue] = useState<string | null>('')
    const [selectIndValue, setSelectIndValue] = useState<string | null>('')

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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
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
                        array={industries}
                        text='Choose industry'
                    />
                </div>
            </div>
            <FilterButton
                searchValue={searchValue}
                selectLocValue={selectLocValue}
                selectIndValue={selectIndValue}
                countries={countries}
                industries={industries}
            />
        </div>
    )
}

interface IFilterButtonProps extends ISearchData {
    countries: ICountry[];
    industries: IIndustry[];
}

const FilterButton = ({ searchValue, selectLocValue,
    selectIndValue, countries, industries }: IFilterButtonProps) => {

    const dispatch = useAppDispatch()
    const isLoading: StatusType = useAppSelector(status)
    const isPopUpVis: boolean = useAppSelector(selectIsPopUpVisible)
    const isShortInfoVisible: boolean = useAppSelector(selectIsShortInfoVisible)

    const itemsPerPage: number | null = useContext(FilterContext)

    const fetchCustomersOnClick = () => {
        dispatch(findCustomers({ searchValue: '', selectLocValue: '', selectIndValue: '', from: 0, to: 0 + itemsPerPage! }))
        dispatch(addRecentSearch({
            searchValue, locIndex: selectLocValue!, selectLocValue: countries[+selectLocValue! - 1]?.name,
            indIndex: selectIndValue!, selectIndValue: industries[+selectIndValue! - 1]?.name,
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

interface IFilterPageSelectProps {
    value: string | null;
    setValue: React.Dispatch<React.SetStateAction<string | null>>;
    array: ICountry[] | IIndustry[];
    text: string;
}

const FilterPageSelect = React.memo(({ value, setValue, array, text }: IFilterPageSelectProps) => {
    const processArr = (fetchedArr: IIndustry[] | ICountry[]) => {
        return fetchedArr.map((prop: IIndustry | ICountry) => ({ value: prop.id, label: prop.name }))
    }

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

interface IFilterLabelProps {
    children: React.ReactNode
    text: string;
}

export const FilterLabel = React.memo(({ children, text }: IFilterLabelProps) => {
    return (
        <div className={`${s.filterLabelWrapper}`}>
            {children}
            <span className={`bold500 ${s.filterLabel}`}>{text}</span>
        </div>
    )
})

interface IFilterBurgerProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterBurger = ({ isVisible, setIsVisible }: IFilterBurgerProps) => {
    return (
        <div className={`bold600 ${s.filtersTitle}`}>
            <div>
                Filters
            </div>
            <div
                className={`${s.burgerContainer} ${s[`change${isVisible}`]}`}
                onClick={() => setIsVisible((value: boolean) => !value)}
            >
                <div className={s.bar1}></div>
                <div className={s.bar2}></div>
                <div className={s.bar3}></div>
            </div>
        </div>
    )
}