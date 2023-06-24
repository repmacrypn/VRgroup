import React from "react";
import { BackToSearch } from "../profilePage/ProfilePage";
import '../../styles/fonts.css'
import s from './UpgradePage.module.css'

export const UpgradePage = () => {
    return (
        <div className={`${s.upgradeWrapper} defaultfontS`}>
            <BackToSearch />
            <div className={`${s.upgradeTitle} bold800`}>
                Upgrade page
            </div>
            <div className={`${s.upgradeAbstract} bold600`}>
                In progress xxD
            </div>
        </div>
    )
}