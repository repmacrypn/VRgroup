import { useContext } from 'react'
import { Button } from '@mantine/core'
import s from './EmptyState.module.css'
import emptyState from '../../../assets/images/noResults.svg'
import { clearFilters, findCustomers, setFilterData, status } from '../../../redux/filterSlice'
import '../../../styles/fonts.css'
import { ms } from '../../../styles/mantineStyles'
import { FilterContext } from '../../../context/contexts'
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppHooks'
import { StatusType } from '../../../models/common/status.type'

export const EmptyState = () => {
    const itemsPerPage = useContext(FilterContext)

    const dispatch = useAppDispatch()
    const isLoading: StatusType = useAppSelector(status)

    const resetFiltersOnClick = (): void => {
        dispatch(clearFilters())
        dispatch(setFilterData({ searchValue: '', selectLocValue: '', selectIndValue: '' }))
        dispatch(findCustomers({ searchValue: '', selectLocValue: '', selectIndValue: '', from: 0, to: 0 + itemsPerPage! }))
    }

    return (
        <EmptyStateInfo
            resetFiltersOnClick={resetFiltersOnClick}
            isLoading={isLoading}
        />
    )
}

interface IEmptyStateInfoProps {
    resetFiltersOnClick: () => void;
    isLoading: StatusType;
}

const EmptyStateInfo = ({ resetFiltersOnClick, isLoading }: IEmptyStateInfoProps) => {
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