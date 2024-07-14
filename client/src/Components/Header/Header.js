import React from 'react'
import './Header.css'
import cclms from '../../images/cclms logo.jpeg'
import cris from '../../images/cris logo.jpeg'
const Header = () => {
  return (
    <div>
      <header className="login-header">
        <h1 className="header">
          <img src={cclms} alt="Cris" />
          <img src={cris} alt="CCLMS" />
        </h1>
      </header>
    </div>
  )
}

export default Header;
