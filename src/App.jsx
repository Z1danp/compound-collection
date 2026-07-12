import LoginForm from "./components/auth/loginform";

function App() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default App;