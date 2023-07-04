import React, { useContext } from 'react'
import { UserCircle, X } from 'tabler-icons-react'
import { Button } from '@mantine/core'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import s from './FilterPage.module.css'
import { selectUserName, setIsVisible } from '../../redux/filterSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { FilterContext } from '../../context/contexts'

export const UserShortInfo = () => {
    const user = useSelector(state => state.filter.currentUser)
    let name = useSelector(state => selectUserName(state, user.id))

    const getUserNameOnClick = useContext(FilterContext)

    name ?
        name = (
            <div className={`${s.userShortInfoName} bold700`}>
                {name}
            </div>
        ) :
        name = (
            <Button
                onClick={(e) => getUserNameOnClick(e, user.id)}
                radius='md'
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.shortInfoRoot),
                }}
            >
                <UserCircle
                    className={s.icon}
                    viewBox="0 -1 24 24"
                    height={18}
                    width={28}
                />
                Get access to name
            </Button>
        )

    return (
        <div className={s.userShortInfoWrapper}>
            <div className={s.userShortInfo}>
                {name}
                <div className={`${s.userInfo} regular400`}>
                    <UserShortData
                        text='Job title'
                        value={user.job_title}
                    />
                    <UserShortData
                        text='Industry'
                        value={user.industry}
                    />
                    <UserShortData
                        text='Location'
                        value={user.country}
                    />
                    <UserShortData
                        text='Description'
                        value={user.description}
                    />
                </div>
            </div>
            <CloseButton />
        </div>
    )
}

const CloseButton = React.memo(() => {
    const dispatch = useDispatch()

    const closeOnClick = () => {
        dispatch(setIsVisible(false))
    }

    return (
        <div
            className={s.closeButton}
            onClick={closeOnClick}>
            <X
                className={s.icon}
                color='#3626A7'
                viewBox="-11 -7 24 24"
                height={16}
                width={16}
            />
        </div>
    )
})

CloseButton.displayName = 'CloseButton'

const UserShortData = React.memo(({ text, value }) => {
    return (
        <div>
            <div className={s.userInfoTitle}>
                {text}
            </div>
            <div>
                {value}
            </div>
        </div>
    )
})

UserShortData.displayName = 'UserShortData'

UserShortData.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
}

