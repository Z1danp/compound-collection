import { useState } from 'react';
import Caffeine from '../icons/Caffeine';
import { useNavigate } from 'react-router-dom';

function RegistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const req = await fetch('http://localhost:3000/regist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
          email,
          password
        })
      })
      if (req.ok) {
        navigate('/')
      }
    } catch(err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 shadow-slate-300/40 ring-slate-900/5">
          {/* Header biru + watermark caffeine putih tipis */}
          <div className="relative overflow-hidden bg-blue-700 px-6 py-6 sm:px-8">
            <Caffeine className="pointer-events-none absolute -top-8 -right-6 w-56 text-white/15" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-extrabold text-blue-700">
                R
              </div>
              <div className="text-white">
                <h1 className="text-xl leading-tight font-bold">Renik Notes</h1>
                <p className="text-sm text-blue-100">
                  Catalogue &amp; Compound Notes
                </p>
              </div>
            </div>
          </div>

          {/* Body (flex-col) */}
          <div className="flex flex-col px-6 py-8 sm:px-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">Sign Up</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-11 text-slate-700 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.22A10.5 10.5 0 0 0 1.93 12c1.29 4.16 5.16 7 10.07 7 1.6 0 3.12-.3 4.5-.86m-6.29-9.79a3 3 0 1 0 4.24 4.24M9.88 9.88 3 3m6.88 6.88 4.24 4.24m0 0L21 21m-6.88-6.88a3 3 0 0 0-4.24-4.24m10.15 6.36A10.46 10.46 0 0 0 22.07 12c-1.3-4.16-5.16-7-10.07-7-.9 0-1.78.1-2.62.28"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.04 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4.5 12 4.5s8.57 3.01 9.96 7.18a1 1 0 0 1 0 .64C20.58 16.49 16.64 19.5 12 19.5s-8.57-3.01-9.96-7.18Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-600/40 focus:outline-none"
              >
                Sign Up
              </button>

              {/* Notif error / validasi muncul di sini, di bawah tombol */}
              {error && (
                <p className="text-center text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a href="#" className="font-bold text-blue-700 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistForm;
