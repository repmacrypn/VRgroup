import { useContext } from 'react'
import { ChevronLeft, ChevronRight } from 'tabler-icons-react'
import ReactPaginate from 'react-paginate'
import s from './FilterPage.module.css'
import '../../styles/fonts.css'
import { findCustomers, setPageNumber, showPopUp } from '../../redux/filterSlice'
import { FilterContext } from '../../context/contexts'
import { ITotalCount } from '../../models/common/total.interface'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { ISearchData } from '../../models/common/searchData.interface'

export const Pagination = ({ totalCount }: ITotalCount) => {
    const dispatch = useAppDispatch()
    const filterData: ISearchData = useAppSelector(state => state.filter.filterData)

    const itemsPerPage = useContext(FilterContext)
    const pageCount: number = Math.ceil(totalCount! / itemsPerPage!)
    const pageNumber: number = useAppSelector(state => state.filter.pageNumber)

    const handlePageChange = ({ selected }: { selected: number }): void => {
        const newOffset: number = (selected * itemsPerPage!) % totalCount!
        if (newOffset >= 60) {
            dispatch(showPopUp(true))
        } else {
            dispatch(findCustomers({
                searchValue: filterData.searchValue, selectLocValue: filterData.selectLocValue!,
                selectIndValue: filterData.selectIndValue!, from: newOffset, to: newOffset + itemsPerPage!,
            }))
        }
        dispatch(setPageNumber(selected))
    }

    return (
        <ReactPaginate
            previousLabel={
                <ChevronLeft
                    className={s.icon}
                    viewBox="0 0 24 24"
                    height={14}
                    width={20}
                />
            }
            nextLabel={
                <ChevronRight
                    className={s.icon}
                    viewBox="-2 0 24 24"
                    height={14}
                    width={20}
                />
            }
            breakLabel={null}
            pageCount={pageCount}
            marginPagesDisplayed={0}
            pageRangeDisplayed={4}
            onPageChange={handlePageChange}
            forcePage={pageNumber}
            containerClassName={s.pagination}
            breakClassName={s.navLi}
            previousClassName={s.navLi}
            nextClassName={s.navLi}
            pageClassName={s.navLi}
            activeLinkClassName={s.active}
            breakLinkClassName={s.navA}
            pageLinkClassName={s.navA}
            previousLinkClassName={`${s.navA} ${s.moveButton}`}
            nextLinkClassName={`${s.navA} ${s.moveButton}`}
        />
    )
}