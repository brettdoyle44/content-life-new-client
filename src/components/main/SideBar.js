import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import halfmoon from 'halfmoon';
import { Context } from '../../context/store';
import { Menu, Zap, BarChart2, Columns, Calendar } from 'react-feather';
import logo from '../../images/CL-Final-Logo-long-WHITE.png';
import logoTwo from '../../images/CL-Final-Logo-Long-Color.png';

export default function SideBar() {
  const [dark, setDark] = useState(false);
  const { dispatch } = useContext(Context);

  useEffect(() => {
    halfmoon.onDOMContentLoaded();
    setDark(true);
  }, []);

  // function toggleDarkMode() {
  //   halfmoon.toggleDarkMode();
  //   setDark(!dark);
  // }

  const menuStyle = {
    width: '1em',
    height: 'auto',
  };

  const iconStyle = {
    width: '1em',
    height: 'auto',
  };

  function toggleBar() {
    halfmoon.toggleSidebar();
  }

  // async function handleLogout() {
  //   try {
  //     await Auth.signOut();
  //     dispatch({ type: 'USER_LOGOUT' });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  return (
    <>
      <nav className="navbar d-flex align-items-center">
        <div className="navbar-content">
          <button
            id="toggle-sidebar-btn"
            className="btn btn-action d-flex justify-content-center align-items-center"
            type="button"
            onClick={toggleBar}
          >
            <Menu style={menuStyle} />
          </button>
        </div>
        <img
          src={dark ? logo : logoTwo}
          alt="logo"
          className="w-150 ml-10 ml-sm-20"
        />
      </nav>
      <div className="sidebar-overlay" onClick={toggleBar}></div>
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-content">
            <input type="text" className="form-control" placeholder="Search" />
            <div className="mt-10 font-size-12">
              Press <kbd>/</kbd> to focus
            </div>
          </div>
          <h5 className="sidebar-title">Apps</h5>
          <div className="sidebar-divider"></div>
          <Link
            to="/ideas"
            className="sidebar-link sidebar-link-with-icon active"
          >
            <span className="sidebar-icon bg-transparent">
              <Zap style={iconStyle} />
            </span>
            Ideas
          </Link>
          <Link
            to="/storyboard"
            className="sidebar-link sidebar-link-with-icon"
          >
            <span className="sidebar-icon bg-transparent">
              <Columns style={iconStyle} />
            </span>
            Storyboards
          </Link>
          <Link to="/calendar" className="sidebar-link sidebar-link-with-icon">
            <span className="sidebar-icon bg-transparent">
              <Calendar style={iconStyle} />
            </span>
            Calendar
          </Link>
          <Link to="/analytics" className="sidebar-link sidebar-link-with-icon">
            <span className="sidebar-icon bg-transparent">
              <BarChart2 style={iconStyle} />
            </span>
            Analytics
          </Link>
        </div>
      </div>
    </>
  );
}
