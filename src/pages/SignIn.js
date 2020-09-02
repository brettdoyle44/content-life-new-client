import React, { useContext, useRef, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Context } from '../context/store';

export default function SignIn() {
  const invalidRef = useRef(null);
  const { store, dispatch } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidText, setInvalidText] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await Auth.signIn(email, password);
      dispatch({ type: 'USER_HAS_AUTH' });
    } catch (e) {
      setInvalidText(e.message);
      invalidRef.current.classList.remove('d-none');
      invalidRef.current.classList.add('invalid-feedback');
    }
  }

  function handleAuthToggle() {
    dispatch({ type: 'AUTH_TOGGLE', payload: !store.authToggle });
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-20">
      <form onSubmit={handleSubmit} className="w-400 mw-full">
        <div ref={invalidRef} className="d-none">
          {invalidText}
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Email"
            required="required"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            required="required"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          className="btn btn-primary btn-block"
          type="submit"
          value="Sign In"
        />
        <button className="btn btn-primary mt-10" onClick={handleAuthToggle}>
          Register
        </button>
      </form>
    </div>
  );
}
