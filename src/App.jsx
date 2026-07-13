import LoginForm from "./components/auth/loginform";
import RegistForm from "./components/auth/registform";
import AuthProvider  from "./components/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>
    </div>
    </AuthProvider>
  );
}

export default App;