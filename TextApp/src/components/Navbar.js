import React from 'react';
import propTypes from "prop-types";
import { Link } from 'react-router-dom';

export default function Navbar(pro) {

    const changeTheme = (e) => {
        let theme = e.target.classList[1]
        pro.toggleColorMode(theme)
        let active = e.target.parentElement.childNodes;
        active.forEach(a => {
            if (a !== e.target) {
                a.classList.remove('activeTemplate')
            }
            else {
                if (!e.target.classList.contains('activeTemplate')) {
                    a.classList.add('activeTemplate')
                    pro.showAlert(`${theme} theme is Set`, 'Success')
                }
            }
        });
    }

    return (
        <>
            <nav className='navbar' style={{ backgroundColor: pro.colorMode.navBarbackgroundColor }}>
                <div className="main">
                    <h2 ><Link to='/' style={{ color: pro.colorMode.navBarh2 }}>{pro.title}</Link></h2>
                    <ul className='menuItems'>
                        <li className="item"><Link to="/" style={{ color: pro.colorMode.navBarATag }} >Home</Link></li>
                        <li className="item"><Link to="/about" style={{ color: pro.colorMode.navBarATag }} >About</Link></li>
                    </ul>
                </div>
                <div className="right">
                    <span className="colorTemplate white activeTemplate" onClick={changeTheme}></span>
                    <span className="colorTemplate black" onClick={changeTheme}></span>
                    <span className="colorTemplate red" onClick={changeTheme}></span>
                    <span className="colorTemplate green" onClick={changeTheme}></span>
                </div>
            </nav >
        </>
    )
};

Navbar.propTypes = {
    title: propTypes.string.isRequired,
    aboutText: propTypes.string
}

Navbar.defaultProps = {
    title: "{Set Title}",
    aboutText: "About"
}
