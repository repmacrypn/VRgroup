import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import s from './FilterPage.module.css'
import { UpgragePopUp } from './UpgradePopUp'
import { UserTable } from './UserTable'
import { FilterBurger, FilterField } from './FilterForm'
import { selectIsAuth } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { FilterContext } from '../../context/contexts'
import { useAppSelector } from '../../hooks/useAppHooks'
import { selectIsPopUpVisible } from '../../redux/filterSlice'

export const FilterPage = () => {
    const isAuth: boolean = useAppSelector(selectIsAuth)
    const itemsPerPage: number = useAppSelector(state => state.filter.itemsPerPage)

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
                <ResultData />
            </div>
        </FilterContext.Provider>
    )
}

const Filter = () => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className={s.filterBurgerWrapper}>
            <FilterBurger
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            <FilterField
                classN={`changeVis${isVisible}`}
            />
        </div>
    )
}

const ResultData = () => {
    const isPopUpVis: boolean = useAppSelector(selectIsPopUpVisible)
    const totalCount: number | null = useAppSelector(state => state.filter.totalCount)

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

const Total = ({ totalCount }: { totalCount: number | null }) => {
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
