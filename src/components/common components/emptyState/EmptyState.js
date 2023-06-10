import React from "react";
import s from './EmptyState.module.css';
import emptyState from '../../../asserts/images/emptyState.png';
import { connect } from "react-redux";
import { getVacanciesOnFieldLoad } from '../../../redux/vacanciesReducer';
import { Link } from "react-router-dom";

const EmptyState = ({ isButtonNeeded }) => {
    return <div className={s.emptyWrapper}>
        <img
            className={s.emptyState}
            alt="empty state"
            src={emptyState}
            width='240px'
            height='230px'
        />
        <div className={s.emptyTitle}>
            Упс, здесь еще ничего нет!
        </div>
        {
            isButtonNeeded &&
            <div className={s.emptyButton}>
                <Link to='/vacancies/*'>Поиск Вакансий</Link>
            </div>
        }
    </div>
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getVacanciesOnFieldLoad })(EmptyState);