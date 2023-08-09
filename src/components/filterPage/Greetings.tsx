import { useContext } from 'react'
import { Briefcase, BuildingSkyscraper, History, MapPin } from 'tabler-icons-react'
import s from './FilterPage.module.css'
import { FilterLabel } from './FilterForm'
import '../../styles/fonts.css'
import { findCustomers, status, clearFilters } from '../../redux/filterSlice'
import { FilterContext } from '../../context/contexts'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { IRecentsArray } from '../../models/common/recentsArray.interface'
import { StatusType } from '../../models/common/status.type'

export const GreetingsState = () => {
    return (
        <div className={s.greetStWrapper}>
            <div className={`${s.filtersTip} bold500`}>
                Add filters to begin your search
            </div>
            <div className={s.greetsEmptyState}>
                Start your people search by applying
                any filter in the panel
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
    const recentSearchArray: IRecentsArray[] = useAppSelector(state => state.filter.recentSearchArray)
    const recentResultArray = recentSearchArray.map((searchData: IRecentsArray) => (
        <RecentItem
            key={searchData.id}
            searchData={searchData}
        />
    ))

    return (
        <div className={s.recentSearchBorder}>
            {
                recentSearchArray.length ?
                    recentResultArray :
                    <div className={`${s.recentSearches} bold500`}>
                        Your last four searches will be here for quick access
                    </div>
            }
        </div>
    )
}

const RecentItem = ({ searchData }: { searchData: IRecentsArray }) => {
    const dispatch = useAppDispatch()
    const isLoading: StatusType = useAppSelector(status)
    const itemsPerPage: number | null = useContext(FilterContext)

    const getCustomersOnClick = () => {
        dispatch(clearFilters())
        dispatch(findCustomers({
            searchValue: searchData.searchValue, selectLocValue: searchData.locIndex,
            selectIndValue: searchData.indIndex, from: 0, to: 0 + itemsPerPage!,
        }))
    }

    return (
        <button
            onClick={getCustomersOnClick}
            disabled={isLoading === 'loading'}
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