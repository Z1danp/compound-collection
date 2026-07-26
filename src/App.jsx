import LoginForm from './components/auth/loginform.jsx';
import RegistForm from './components/auth/registform.jsx';
import { AuthProvider } from './components/auth/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Collection from './components/collection/Collection.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/regist" element={<RegistForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Collection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
