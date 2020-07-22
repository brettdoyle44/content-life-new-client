import React, { useContext } from 'react';
import SignIn from './SignIn';
import Register from './Register';
import { Context } from '../context/store';

export default function Auth() {
  const { store } = useContext(Context);

  return (
    <>
      {store.authToggle ? (
        <div>
          <SignIn />
        </div>
      ) : (
        <div>
          <Register />
        </div>
      )}
    </>
  );
}
