import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { RiEyeLine, RiEyeCloseLine, RiArrowLeftLine } from 'react-icons/ri';

/* ─────────────────────────────────────────────────────────────
   Auth — DeviceYangu
   Theme: Minimal 3D · Black / White / Gray

   IMPORTANT: InputField, LoginForm, SignupForm, and
   DecorativePanel are all defined OUTSIDE the Auth component.
   Defining components inside a parent causes React to treat
   them as new component types on every render, unmounting and
   remounting the inputs — which drops focus and loses the cursor.
───────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════
   InputField
══════════════════════════════════════════════════════════════ */
const InputField = ({
  id, label, type, name, value, onChange, error,
  placeholder, autoComplete, toggleButton, onToggle, showPassword,
  rightSlot,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </label>
      {rightSlot}
    </div>
    <div className="relative">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3 rounded-xl text-sm text-black placeholder:text-zinc-400
          bg-zinc-50 border transition-all duration-150 outline-none
          ${error
            ? 'border-zinc-800 ring-1 ring-zinc-800'
            : 'border-zinc-200 focus:border-black focus:ring-1 focus:ring-black'
          }
        `}
        style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
      />
      {toggleButton && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-black transition-colors"
        >
          {showPassword ? <RiEyeCloseLine size={16} /> : <RiEyeLine size={16} />}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1.5 text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   LoginForm
══════════════════════════════════════════════════════════════ */
const LoginForm = ({
  loginData, loginErrors, handleLoginChange, handleLoginSubmit,
  showLoginPassword, setShowLoginPassword, isLoading,
}) => (
  <form onSubmit={handleLoginSubmit} className="space-y-5">
    <InputField
      id="login-email"
      label="Email address"
      type="email"
      name="email"
      value={loginData.email}
      onChange={handleLoginChange}
      error={loginErrors.email}
      placeholder="you@example.com"
      autoComplete="email"
    />

    <InputField
      id="login-password"
      label="Password"
      type={showLoginPassword ? 'text' : 'password'}
      name="password"
      value={loginData.password}
      onChange={handleLoginChange}
      error={loginErrors.password}
      placeholder="••••••••"
      autoComplete="current-password"
      toggleButton
      onToggle={() => setShowLoginPassword((v) => !v)}
      showPassword={showLoginPassword}
      rightSlot={
        <Link
          to="/forgot-password"
          className="text-[11px] font-semibold text-zinc-400 hover:text-black transition-colors"
        >
          Forgot password?
        </Link>
      }
    />

    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center gap-2 bg-black text-white
                 font-bold text-sm py-3.5 rounded-xl transition-all duration-150
                 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed
                 active:scale-[0.99]"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)' }}
    >
      {isLoading
        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        : 'Sign in →'
      }
    </button>
  </form>
);

/* ══════════════════════════════════════════════════════════════
   SignupForm
══════════════════════════════════════════════════════════════ */
const SignupForm = ({
  signupData, signupErrors, handleSignupChange, handleSignupSubmit,
  showSignupPassword, setShowSignupPassword,
  showConfirmPassword, setShowConfirmPassword,
  passwordStrength, strengthLabel, strengthColors,
  isLoading,
}) => (
  <form onSubmit={handleSignupSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <InputField
        id="signup-first"
        label="First name"
        type="text"
        name="firstName"
        value={signupData.firstName}
        onChange={handleSignupChange}
        error={signupErrors.firstName}
        placeholder="Jane"
        autoComplete="given-name"
      />
      <InputField
        id="signup-last"
        label="Last name"
        type="text"
        name="lastName"
        value={signupData.lastName}
        onChange={handleSignupChange}
        error={signupErrors.lastName}
        placeholder="Doe"
        autoComplete="family-name"
      />
    </div>

    <InputField
      id="signup-email"
      label="Email address"
      type="email"
      name="email"
      value={signupData.email}
      onChange={handleSignupChange}
      error={signupErrors.email}
      placeholder="you@example.com"
      autoComplete="email"
    />

    {/* Password + strength meter */}
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
          Password
        </label>
      </div>
      <div className="relative">
        <input
          id="signup-password"
          type={showSignupPassword ? 'text' : 'password'}
          name="password"
          value={signupData.password}
          onChange={handleSignupChange}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          className={`
            w-full px-4 py-3 rounded-xl text-sm text-black placeholder:text-zinc-400
            bg-zinc-50 border transition-all duration-150 outline-none
            ${signupErrors.password
              ? 'border-zinc-800 ring-1 ring-zinc-800'
              : 'border-zinc-200 focus:border-black focus:ring-1 focus:ring-black'
            }
          `}
          style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
        />
        <button
          type="button"
          onClick={() => setShowSignupPassword((v) => !v)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-black transition-colors"
        >
          {showSignupPassword ? <RiEyeCloseLine size={16} /> : <RiEyeLine size={16} />}
        </button>
      </div>

      {signupData.password && (
        <div className="mt-2 space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-0.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= passwordStrength ? strengthColors[passwordStrength] : '#e4e4e7' }}
              />
            ))}
          </div>
          <p className="text-[11px] font-bold" style={{ color: strengthColors[passwordStrength] }}>
            {strengthLabel}
          </p>
        </div>
      )}
      {signupErrors.password && (
        <p className="mt-1.5 text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
          {signupErrors.password}
        </p>
      )}
    </div>

    <InputField
      id="signup-confirm"
      label="Confirm password"
      type={showConfirmPassword ? 'text' : 'password'}
      name="confirmPassword"
      value={signupData.confirmPassword}
      onChange={handleSignupChange}
      error={signupErrors.confirmPassword}
      placeholder="Repeat your password"
      autoComplete="new-password"
      toggleButton
      onToggle={() => setShowConfirmPassword((v) => !v)}
      showPassword={showConfirmPassword}
    />

    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center gap-2 bg-black text-white
                 font-bold text-sm py-3.5 rounded-xl transition-all duration-150
                 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed
                 active:scale-[0.99]"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)' }}
    >
      {isLoading
        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        : 'Create account →'
      }
    </button>
  </form>
);

/* ══════════════════════════════════════════════════════════════
   DecorativePanel
══════════════════════════════════════════════════════════════ */
const DecorativePanel = ({ isLogin }) => (
  <div className="relative hidden lg:flex lg:w-1/2 bg-black overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse 80% 70% at 40% 50%, #1a1a1a 0%, #000 100%)' }}
    />
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)' }}
    />

    <div className="relative z-10 flex flex-col justify-between p-14 lg:p-16 w-full">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter">
          <span className="text-white">Device</span>
          <span className="text-zinc-500">Yangu</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
        >
          <RiArrowLeftLine size={14} /> Back to store
        </Link>
      </div>

      <div className="space-y-5">
        <h2
          className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]"
          style={{ textShadow: '0 2px 40px rgba(255,255,255,0.06)' }}
        >
          {isLogin
            ? <><span>Welcome</span><br /><span>back.</span></>
            : <><span>Smart</span><br /><span>shopping</span><br /><span>starts here.</span></>
          }
        </h2>
        <p className="text-zinc-500 text-base leading-relaxed max-w-xs">
          {isLogin
            ? 'Sign in to access your account, track orders, and unlock exclusive deals.'
            : 'Get KSh 500 off your first order, early access to deals, and loyalty rewards.'
          }
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(isLogin
          ? ['📦 50,000+ orders delivered', '⚡ Same-day shipping', '🛡️ 2-Year warranty']
          : ['🎁 KSh 500 off first order', '🔔 Early access to deals', '⭐ Loyalty rewards']
        ).map((pill) => (
          <div
            key={pill}
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-zinc-400 border border-zinc-800"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
          >
            {pill}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   Auth  (state + logic only — no component definitions inside)
══════════════════════════════════════════════════════════════ */
const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  const [loginData, setLoginData]                 = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors]             = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [signupErrors, setSignupErrors]               = useState({});
  const [showSignupPassword, setShowSignupPassword]   = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    const p = signupData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, [signupData.password]);

  const strengthLabel  = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColors = ['', '#bbb', '#888', '#555', '#000'];

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((p) => ({ ...p, [name]: value }));
    if (loginErrors[name]) setLoginErrors((p) => ({ ...p, [name]: '' }));
    if (error) setError('');
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginData.email)                            errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errs.email    = 'Enter a valid email';
    if (!loginData.password)                         errs.password = 'Password is required';
    else if (loginData.password.length < 6)          errs.password = 'At least 6 characters';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: loginData.email, password: loginData.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.is_admin ? '/admin-dashboard' : '/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((p) => ({ ...p, [name]: value }));
    if (signupErrors[name]) setSignupErrors((p) => ({ ...p, [name]: '' }));
    if (error) setError('');
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupData.firstName.trim())                       errs.firstName       = 'First name is required';
    if (!signupData.lastName.trim())                        errs.lastName        = 'Last name is required';
    if (!signupData.email)                                  errs.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email))       errs.email           = 'Enter a valid email';
    if (!signupData.password)                               errs.password        = 'Password is required';
    else if (signupData.password.length < 8)                errs.password        = 'At least 8 characters required';
    if (signupData.confirmPassword !== signupData.password) errs.confirmPassword = 'Passwords do not match';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateSignup()) return;
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/register', {
        firstName: signupData.firstName, lastName: signupData.lastName,
        email: signupData.email, password: signupData.password,
      });
      alert(res.data.message || 'Registration successful!');
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin((v) => !v);
    setError('');
    setLoginErrors({});
    setSignupErrors({});
    if (!isLogin) {
      setLoginData({ email: '', password: '' });
      setShowLoginPassword(false);
    } else {
      setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
      setShowSignupPassword(false);
      setShowConfirmPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      <DecorativePanel isLogin={isLogin} />

      <div className="flex-1 flex items-center justify-center px-6 py-14 lg:px-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-xl font-black tracking-tighter">
              <span className="text-black">Device</span>
              <span className="text-zinc-400">Yangu</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-black">
              {isLogin ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-medium">
              {isLogin ? 'Access your DeviceYangu account' : 'Start shopping smarter today'}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50
                         text-sm text-zinc-700 flex items-start gap-2"
              style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0 mt-1" />
              {error}
            </div>
          )}

          {/* Toggle tabs */}
          <div
            className="flex mb-8 p-1 rounded-xl bg-zinc-100 border border-zinc-200"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
          >
            {['Sign in', 'Register'].map((label, i) => {
              const active = isLogin ? i === 0 : i === 1;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { if (!active) toggleForm(); }}
                  className={`
                    flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-150
                    ${active ? 'bg-black text-white shadow-sm' : 'text-zinc-500 hover:text-black'}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* key prop here is intentional: only remounts on tab switch, never on keystrokes */}
          <div
            key={isLogin ? 'login' : 'signup'}
            style={{ animation: 'authFormIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1) both' }}
          >
            {isLogin ? (
              <LoginForm
                loginData={loginData}
                loginErrors={loginErrors}
                handleLoginChange={handleLoginChange}
                handleLoginSubmit={handleLoginSubmit}
                showLoginPassword={showLoginPassword}
                setShowLoginPassword={setShowLoginPassword}
                isLoading={isLoading}
              />
            ) : (
              <SignupForm
                signupData={signupData}
                signupErrors={signupErrors}
                handleSignupChange={handleSignupChange}
                handleSignupSubmit={handleSignupSubmit}
                showSignupPassword={showSignupPassword}
                setShowSignupPassword={setShowSignupPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                passwordStrength={passwordStrength}
                strengthLabel={strengthLabel}
                strengthColors={strengthColors}
                isLoading={isLoading}
              />
            )}
          </div>

          <p className="mt-7 text-center text-xs text-zinc-400">
            By continuing you agree to DeviceYangu's{' '}
            <Link to="/terms" className="text-black font-semibold hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-black font-semibold hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes authFormIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Auth;