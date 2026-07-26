import LoginForm from 'src/components/auth/loginform.jsx';
import RegistForm from 'src/components/auth/registform.jsx';
import { AuthProvider } from 'src/components/auth/AuthContext.jsx';
import ProtectedRoute from 'src/components/auth/ProtectedRoute.jsx';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Collection from 'src/components/collection/Collection.jsx';

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
