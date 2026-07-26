import { createContext, useContext, useReducer, useEffect } from 'react';
import { authReducer, initialState } from './authReducer.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    async function checkSession() {
      dispatch({ type: 'CHECK_START' });
      try {
        const res = await fetch('http://localhost:3000/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          dispatch({ type: 'CHECK_FAIL' });
          return;
        }

        const data = await res.json();
        dispatch({ type: 'CHECK_SUCCESS', payload: data });
      } catch {
        dispatch({ type: 'CHECK_FAIL' });
      }
    }

    checkSession();
  }, []);

  async function login({ email, password }) {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.message });
      throw err;
    }
  }

  async function loginAsGuest() {
    dispatch({ type: 'LOGIN_START' });
    try {
      const req = await fetch('http://localhost:3000/guest', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await req.json();

      if (!req.ok) {
        throw new Error(data.error);
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.message });
      throw err;
    }
  }

  async function logout() {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
