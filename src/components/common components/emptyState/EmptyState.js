import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mantine/core'
import { useDispatch, useSelector } from 'react-redux'
import s from './EmptyState.module.css'
import emptyState from '../../../assets/images/noResults.svg'
import { findCustomers, selectItemsPerPage, status } from '../../../redux/filterSlice'
import { FilterContext } from '../../filterPage/FilterPage'
import '../../../styles/fonts.css'
import { ms } from '../../../styles/mantineStyles'

export const EmptyState = () => {
    const { setSearchValue, setSelectLocValue, setSelectIndValue } = useContext(FilterContext)
    const itemsPerPage = useSelector(selectItemsPerPage)
    const isLoading = useSelector(status)
    const dispatch = useDispatch()

    const resetFiltersOnClick = () => {
        dispatch(findCustomers({ searchValue: '', selectLocValue: '', selectIndValue: '', from: 0, to: 0 + itemsPerPage }))
        setSearchValue('')
        setSelectLocValue('')
        setSelectIndValue('')
    }

    return <EmptyStateInfo
        resetFiltersOnClick={resetFiltersOnClick}
        isLoading={isLoading}
    />
}

const EmptyStateInfo = ({ resetFiltersOnClick, isLoading }) => {
    return (
        <div className={s.emptyWrapper}>
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
            <Button
                onClick={resetFiltersOnClick}
                disabled={isLoading === 'loading'}
                radius='md'
                styles={{
                    root: ms.button.emptyRoot,
                }}
            >
                Clear filters
            </Button>
        </div>
    )
}

EmptyStateInfo.propTypes = {
    resetFiltersOnClick: PropTypes.func,
    isLoading: PropTypes.string,
}