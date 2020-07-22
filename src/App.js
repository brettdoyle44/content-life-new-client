import React, { useEffect, useReducer, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import AuthPage from './pages/Auth';
import SideBar from './components/main/SideBar';
import halfmoon from 'halfmoon';
import Routes from './routes/routes';
import { Auth } from 'aws-amplify';
import { initialState, reducer, Context } from './context/store';

function App() {
  const isMounted = useRef(true);
  const [store, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isMounted.current) {
      onLoad();
    }
    return () => (isMounted.current = true);
  }, []);

  async function onLoad() {
    halfmoon.onDOMContentLoaded();
    try {
      await Auth.currentSession();
      dispatch({ type: 'USER_HAS_AUTH' });
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    // dispatch({ type: 'USER_IS_AUTH' });
  }

  function renderSignIn() {
    return <AuthPage />;
  }

  function renderHomePage() {
    return (
      <div className="page-wrapper with-sidebar">
        <SideBar />
        <div className="content-wrapper">
          <Routes />
        </div>
      </div>
    );
  }

  return (
    <Context.Provider value={{ store, dispatch }}>
      <>{store.isSignIn ? renderHomePage() : renderSignIn()}</>
    </Context.Provider>
  );
}

export default withRouter(App);
