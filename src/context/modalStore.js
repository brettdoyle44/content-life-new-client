import React from 'react';

const modalInitialState = {
  showStoryModal: false,
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_STORY_MODAL':
      return { ...state, showStoryModal: action.payload };
    default:
      throw new Error();
  }
};

const ModalContext = React.createContext();

export { modalInitialState, modalReducer, ModalContext };
