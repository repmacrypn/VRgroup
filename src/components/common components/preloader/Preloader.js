import React from 'react'
import preloader from '../../../assets/preloader/preloader.svg'
import s from './Preloader.module.css'

const Preloader = () => {
    return (
        <div className={s.preloader}>
            <img alt='preloader' src={preloader} />
        </div>
    )
}

export default Preloader