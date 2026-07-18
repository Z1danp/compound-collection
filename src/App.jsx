import LoginForm from './components/auth/loginform';
import RegistForm from './components/auth/registform';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Collection from './components/collection/Collection';

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
