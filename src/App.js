import React, { useEffect, useReducer, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AuthPage from './pages/Auth';
import SideBar from './components/main/SideBar';
import halfmoon from 'halfmoon';
import Routes from './routes/routes';
import { Auth } from 'aws-amplify';
import { initialState, reducer, Context } from './context/store';
import AddStoryModal from './components/storyboards/AddStoryModal';

function App() {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(true);
  const [store, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isMounted.current) {
      halfmoon.onDOMContentLoaded();
      halfmoon.toggleDarkMode();
      onLoad();
    }
    return () => (isMounted.current = true);
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      dispatch({ type: 'USER_HAS_AUTH' });
      setLoading(false);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  }

  function renderSignIn() {
    return <AuthPage />;
  }

  function renderHomePage() {
    return (
      <div
        className="page-wrapper with-navbar with-sidebar with-transitions"
        data-sidebar-type="overlayed-sm-and-down"
      >
        <SideBar />

        <div className="content-wrapper">
          <Routes />
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {!loading && (
        <Context.Provider value={{ store, dispatch }}>
          <AddStoryModal />
          <div>{store.isSignIn ? renderHomePage() : renderSignIn()}</div>
        </Context.Provider>
      )}
    </React.Fragment>
  );
}

export default withRouter(App);
