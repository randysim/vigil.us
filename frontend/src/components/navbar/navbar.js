import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="navbar">
                <Link to="/" class="navElem">
                    <div>Home</div>
                </Link>
            </div>
        )
    }
}