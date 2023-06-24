import React, { useContext } from 'react'
import s from './EmptyState.module.css'
import emptyState from '../../../assets/images/noResults.svg'
import { useDispatch, useSelector } from 'react-redux'
import { findCustomers, selectItemsPerPage } from '../../../redux/filterSlice'
import { FilterContext } from '../../filterPage/FilterPage'
import '../../../styles/fonts.css'

export const EmptyState = () => {
    const { setSearchValue, setSelectLocValue, setSelectIndValue } = useContext(FilterContext)

    const itemsPerPage = useSelector(selectItemsPerPage)
    const dispatch = useDispatch()

    const resetFiltersOnClick = () => {
        dispatch(findCustomers({ searchValue: '', selectLocValue: '', selectIndValue: '', from: 0, to: 0 + itemsPerPage }))
        setSearchValue('')
        setSelectLocValue('')
        setSelectIndValue('')
    }

    return <div className={s.emptyWrapper}>
        <img
            className={s.emptyState}
            alt="empty state"
            src={emptyState}
            width='240px'
            height='230px'
        />
        <div className={s.emptyTitle}>
            No results found
        </div>
        <div className={`${s.emptyAbstract} regular400`}>
            We couldn’t find what you searched for.
            Please try again.
        </div>
        <button onClick={resetFiltersOnClick} className={`${s.emptyButton} bold600`}>
            Clear filters
        </button>
    </div>
}