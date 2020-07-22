import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import halfmoon from 'halfmoon';
import { Context } from '../../context/store';
import logo from '../../images/CL-Final-Logo-long-WHITE.png';
import logoTwo from '../../images/CL-Final-Logo-Long-Color.png';

export default function SideBar() {
  const [dark, setDark] = useState(false);
  const { dispatch } = useContext(Context);

  function toggleDarkMode() {
    halfmoon.toggleDarkMode();
    setDark(!dark);
  }

  async function handleLogout() {
    try {
      await Auth.signOut();
      dispatch({ type: 'USER_LOGOUT' });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link href="#" className="sidebar-brand w-200">
          <img src={dark ? logo : logoTwo} alt="logo" />
        </Link>

        <div className="d-flex flex-row justify-content-start align-items-center ml-20 pb-10">
          <img
            src="https://www.gethalfmoon.com/static/site/img/image-2.png"
            className="h-50 img-fluid rounded-circle mr-10"
            alt="avatar"
          />
          <div className="dropdown">
            <button
              className="btn"
              data-toggle="dropdown"
              type="button"
              id="dropdown-toggle-btn-1"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Click me{' '}
              <i className="fa fa-angle-down ml-5" aria-hidden="true"></i>
            </button>
            <div
              className="dropdown-menu"
              aria-labelledby="dropdown-toggle-btn-1"
            >
              <h6 className="dropdown-header">Header</h6>
              <Link onClick={handleLogout} className="dropdown-item">
                Logout
              </Link>
              <Link href="#" className="dropdown-item">
                Link 2
              </Link>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button className="btn btn-block" type="button">
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-divider"></div>
        <Link href="#" className="sidebar-link">
          Ideas
        </Link>
        <Link href="#" className="sidebar-link">
          Analytics
        </Link>
        <Link href="#" className="sidebar-link">
          Storyboards
        </Link>
        <Link href="#" className="sidebar-link">
          Calendar
        </Link>
        <button
          className="btn btn-primary"
          type="button"
          onClick={toggleDarkMode}
        >
          Click me!
        </button>
      </div>
    </div>
  );
}
