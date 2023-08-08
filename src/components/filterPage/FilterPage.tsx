import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import s from './FilterPage.module.css'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { FilterBurger, FilterField } from './FilterForm'
import { FilterContext } from '../../context/contexts'
import { UpgragePopUp } from './UpgradePopUp'
import { UserTable } from './UserTable'

export const FilterPage = () => {
    const isAuth = useSelector(selectIsAuth)
    const isPopUpVis = useSelector(state => state.filter.isPopUpVisible)
    const itemsPerPage = useSelector(state => state.filter.itemsPerPage)

    if (!isAuth) return <Navigate to='/loginPage' />

    return (
        <FilterContext.Provider value={itemsPerPage}>
            <div className={`defaultFontS ${s.filterPageWrapper}`}>
                <div className={s.filterFieldWrapper}>
                    <div className={`bold900 ${s.logoTitle}`}>
                        VRgroup
                    </div>
                    <Filter />
                </div>
                <ResultData isPopUpVis={isPopUpVis} />
            </div>
        </FilterContext.Provider>
    )
}

const Filter = ({ isPopUpVis }) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className={s.filterBurgerWrapper}>
            <FilterBurger
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            <FilterField
                classN={`changeVis${isVisible}`}
                isPopUpVis={isPopUpVis}
            />
        </div>
    )
}

Filter.propTypes = {
    isPopUpVis: PropTypes.bool,
}

const ResultData = ({ isPopUpVis }) => {
    const totalCount = useSelector(state => state.filter.totalCount)

    return (
        <div className={s.filterResultWrapper}>
            <Total totalCount={totalCount} />
            {
                isPopUpVis ||
                <UserTable totalCount={totalCount} />
            }
            {
                isPopUpVis &&
                <UpgragePopUp />
            }
        </div>
    )
}

ResultData.propTypes = {
    isPopUpVis: PropTypes.bool,
}

const Total = ({ totalCount }) => {
    return (
        <div className={`bold700 ${s.filterTotalField}`}>
            <span className={s.totalTitle}>
                Total
            </span>
            <span className={`${s.filterTotalNum}`}>
                {totalCount || 0}
            </span>
        </div>
    )
}

Total.propTypes = {
    totalCount: PropTypes.string,
}
