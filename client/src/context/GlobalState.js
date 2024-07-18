import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQueryClient } from 'react-query';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
};

const GlobalStateContext = createContext(initialState);
const GlobalDispatchContext = createContext();

function globalReducer(state, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      localStorage.setItem('token', action.payload);
      return { ...state, token: action.payload };
    case 'SET_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('GlobalState - Current state:', state);
  }, [state]);

  const wrappedDispatch = (action) => {
    console.log('GlobalState - Dispatching action:', action);
    dispatch(action);
    if (action.type === 'LOGOUT') {
      queryClient.clear();
    }
  };

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={wrappedDispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);