import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header>
            <div>
                <Link to='/profilePage'>
                    NK
                </Link>
            </div>
        </header>
    )
}