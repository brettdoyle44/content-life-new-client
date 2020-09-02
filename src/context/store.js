import React from 'react';

const initialState = {
  isSignIn: false,
  authToggle: true,
  showStoryModal: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_HAS_AUTH':
      return { ...state, isSignIn: true };
    case 'USER_LOGOUT':
      return { ...state, isSignIn: false };
    case 'AUTH_TOGGLE':
      return { ...state, authToggle: action.payload };
    case 'SHOW_STORY_MODAL':
      return { ...state, showStoryModal: action.payload };
    default:
      throw new Error();
  }
};

const Context = React.createContext();

export { initialState, reducer, Context };
