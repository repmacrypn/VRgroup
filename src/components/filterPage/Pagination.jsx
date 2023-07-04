import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'
import s from './FilterPage.module.css'
import { findCustomers, setPageNumber, showPopUp } from '../../redux/filterSlice'
import '../../styles/fonts.css'
import { FilterContext } from '../../context/contexts'
import { ChevronLeft, ChevronRight } from 'tabler-icons-react'

export const Pagination = ({ totalCount }) => {
    const dispatch = useDispatch()
    const filterData = useSelector(state => state.filter.filterData)

    const itemsPerPage = useContext(FilterContext)
    const pageCount = Math.ceil(totalCount / itemsPerPage)
    const pageNumber = useSelector(state => state.filter.pageNumber)

    const handlePageChange = (e) => {
        const newOffset = (e.selected * itemsPerPage) % totalCount
        if (newOffset >= 60) {
            dispatch(showPopUp(true))
        } else {
            dispatch(findCustomers({
                searchValue: filterData.searchValue, selectLocValue: filterData.selectLocValue,
                selectIndValue: filterData.selectIndValue, from: newOffset, to: newOffset + itemsPerPage,
            }))
        }
        dispatch(setPageNumber(e.selected))
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

Pagination.propTypes = {
    totalCount: PropTypes.string,
}