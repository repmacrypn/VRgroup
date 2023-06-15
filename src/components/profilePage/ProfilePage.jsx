import { Input } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

export const ProfilePage = () => {
    const userData = useSelector(state => state.auth.userData)
    const dispatch = useDispatch()

    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    const logoutOnClick = () => {
        dispatch(logout())
    }

    if (!userData) return <Navigate to='/loginPage' />

    return (
        <div>
            <div>
                <Link to='/filterPage'>
                    Back to search
                </Link>
            </div>
            <div>
                <div>Account info</div>
                <div onClick={logoutOnClick}>Log out</div>
                <div>
                    <div>First Name</div>
                    <div>{userData.firstName}</div>
                </div>
                <div>
                    <div>Last Name</div>
                    <div>{userData.lastName}</div>
                </div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
    )
}