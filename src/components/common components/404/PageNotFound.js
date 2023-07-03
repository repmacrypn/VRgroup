import React from 'react'
import s from './PageNotFound.module.css'
import { BackToSearch } from '../../profilePage/ProfilePage'
import '../../../styles/fonts.css'

const PageNotFound = () => {
    return (
        <div className={`defaultfontS ${s.demoMessageAlertWrapper}`}>
            <BackToSearch />
            <div className={`bold700 ${s.demoMessageAlert}`}>
                404 NOT FOUND
            </div>
        </div>
    )
}

export default PageNotFound