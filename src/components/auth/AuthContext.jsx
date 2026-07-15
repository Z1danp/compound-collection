import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login({email, password}) {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({email, password})
    })

    if(!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }

    const data = await res.json()
    setUser(data)
    return data
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    return useContext(AuthContext);
}