import React, { useState, useContext, useRef } from 'react';
import { Context } from '../context/store';
import { Auth } from 'aws-amplify';
// import bgImage from '../images/Background-Asset-03.png';

export default function Register() {
  const invalidGenRef = useRef(null);
  const invalidPassRef = useRef(null);
  const invalidPassInputRef = useRef(null);
  const invalidEmailRef = useRef(null);
  const invalidEmailInputRef = useRef(null);
  const invalidConfirmRef = useRef(null);
  const invalidConfirmInputRef = useRef(null);
  const [newUser, setNewUser] = useState(null);
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [invalidText, setInvalidText] = useState('');
  const { store, dispatch } = useContext(Context);

  function validateEmail(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  async function handleFirstSubmit(e) {
    e.preventDefault();
    invalidPassRef.current.classList.add('d-none');
    invalidPassRef.current.classList.remove('invalid-feedback');
    invalidPassInputRef.current.classList.remove('is-invalid');
    invalidEmailRef.current.classList.add('d-none');
    invalidEmailRef.current.classList.remove('invalid-feedback');
    invalidEmailInputRef.current.classList.remove('is-invalid');
    invalidGenRef.current.classList.add('d-none');
    invalidGenRef.current.classList.remove('invalid-feedback');
    try {
      if (password !== passwordConfirm && validateEmail(email) === false) {
        invalidPassRef.current.classList.remove('d-none');
        invalidPassRef.current.classList.add('invalid-feedback');
        invalidPassInputRef.current.classList.add('is-invalid');
        invalidEmailRef.current.classList.remove('d-none');
        invalidEmailRef.current.classList.add('invalid-feedback');
        invalidEmailInputRef.current.classList.add('is-invalid');
      } else if (password !== passwordConfirm) {
        invalidPassRef.current.classList.remove('d-none');
        invalidPassRef.current.classList.add('invalid-feedback');
        invalidPassInputRef.current.classList.add('is-invalid');
      } else if (validateEmail(email) === false) {
        invalidEmailRef.current.classList.remove('d-none');
        invalidEmailRef.current.classList.add('invalid-feedback');
        invalidEmailInputRef.current.classList.add('is-invalid');
      } else {
        const newUser = await Auth.signUp({
          username: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
        });
        setNewUser(newUser);
      }
    } catch (e) {
      setInvalidText(e.message);
      invalidGenRef.current.classList.remove('d-none');
      invalidGenRef.current.classList.add('invalid-feedback');
    }
  }

  function handleAuthToggle() {
    dispatch({ type: 'AUTH_TOGGLE', payload: !store.authToggle });
  }

  async function handleConfirmSubmit(e) {
    e.preventDefault();
    try {
      await Auth.confirmSignUp(email, confirm);
      await Auth.signIn(email, password);
      dispatch({ type: 'USER_HAS_AUTH' });
    } catch (e) {
      setInvalidText(e.message);
      invalidConfirmRef.current.classList.remove('d-none');
      invalidConfirmRef.current.classList.add('invalid-feedback');
      invalidConfirmInputRef.current.classList.add('is-invalid');
    }
  }
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-20">
        {newUser === null ? (
          <>
            <form onSubmit={handleFirstSubmit} className="w-400 mw-full">
              <div ref={invalidGenRef} className="d-none">
                {invalidText}
              </div>
              <div className="form-row row-eq-spacing-sm">
                <div className="col-sm">
                  <input
                    type="text"
                    className="form-control"
                    id="first-name"
                    placeholder="First name"
                    required="required"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-sm">
                  <input
                    type="text"
                    className="form-control"
                    id="last-name"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div ref={invalidEmailInputRef} className="form-group">
                <div ref={invalidEmailRef} className="d-none">
                  Needs to be a valid email.
                </div>
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
              <div className="form-group" ref={invalidPassInputRef}>
                <div ref={invalidPassRef} className="d-none">
                  Does not match with the password above.
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="confirm-password"
                  placeholder="Confirm password"
                  required="required"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              <input
                className="btn btn-primary btn-block"
                type="submit"
                value="Register"
              />
              <button
                className="btn btn-primary mt-10"
                onClick={handleAuthToggle}
              >
                SignIn
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="w-400 mw-full">
            <div ref={invalidConfirmInputRef} className="form-group">
              <div ref={invalidConfirmRef} className="d-none">
                {invalidText}
              </div>
              <input
                type="text"
                className="form-control"
                id="confirm"
                placeholder="Confirmation Code"
                required="required"
                onChange={(e) => setConfirm(e.target.value)}
              />
              <div className="form-text">
                Check your email for the confirmation code.
              </div>
            </div>
            <input
              className="btn btn-primary btn-block"
              type="submit"
              value="Confirm"
            />
          </form>
        )}
      </div>
    </>
  );
}
