import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { RiEyeLine, RiEyeCloseLine, RiArrowLeftLine, RiAlertLine } from 'react-icons/ri';
import { API } from '..//Components/common/constants';
import loginBanner from '../assets/loginbanner.jpg';

/* ─────────────────────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────────────────────── */
const InputField = ({
  id, label, type, name, value, onChange, error,
  placeholder, autoComplete, toggleButton, onToggle, showPassword,
  rightSlot,
}) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500"
      >
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
          w-full px-4 py-3.5 rounded-sm text-sm font-bold text-black
          placeholder:text-zinc-300 placeholder:font-normal
          bg-white border transition-all duration-150 outline-none
          ${error
            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/30'
            : 'border-zinc-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
          }
        `}
      />
      {toggleButton && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-300 hover:text-orange-500 transition-colors"
        >
          {showPassword ? <RiEyeCloseLine size={16} /> : <RiEyeLine size={16} />}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1.5 text-[11px] font-bold text-red-500 flex items-center gap-1.5">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────────────────────────── */
const LoginForm = ({
  loginData, loginErrors, handleLoginChange, handleLoginSubmit,
  showLoginPassword, setShowLoginPassword, isLoading,
}) => (
  <form onSubmit={handleLoginSubmit} className="space-y-1">
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
      onToggle={() => setShowLoginPassword(v => !v)}
      showPassword={showLoginPassword}
      rightSlot={
        <Link
          to="/forgot-password"
          className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400 hover:text-orange-500 transition-colors"
        >
          Forgot?
        </Link>
      }
    />

    <div className="pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2.5
                   bg-orange-500 hover:bg-orange-600 text-white
                   font-black text-[11px] uppercase tracking-[0.15em]
                   py-4 rounded-sm transition-all duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed
                   active:scale-[0.99]"
        style={{ boxShadow: '0 6px 24px rgba(240,90,26,0.30)' }}
      >
        {isLoading
          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <>Sign In <span className="opacity-70">→</span></>
        }
      </button>
    </div>
  </form>
);

/* ─────────────────────────────────────────────────────────────
   SIGNUP FORM
───────────────────────────────────────────────────────────── */
const SignupForm = ({
  signupData, signupErrors, handleSignupChange, handleSignupSubmit,
  showSignupPassword, setShowSignupPassword,
  showConfirmPassword, setShowConfirmPassword,
  passwordStrength, strengthLabel, strengthColors,
  isLoading,
}) => (
  <form onSubmit={handleSignupSubmit} className="space-y-1">
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

    <div>
      <InputField
        id="signup-password"
        label="Password"
        type={showSignupPassword ? 'text' : 'password'}
        name="password"
        value={signupData.password}
        onChange={handleSignupChange}
        error={signupErrors.password}
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        toggleButton
        onToggle={() => setShowSignupPassword(v => !v)}
        showPassword={showSignupPassword}
      />

      {signupData.password && (
        <div className="mt-2 mb-4 space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-[3px] flex-1 rounded-sm transition-all duration-300"
                style={{ background: i <= passwordStrength ? strengthColors[passwordStrength] : '#e4e4e7' }}
              />
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em]"
             style={{ color: strengthColors[passwordStrength] }}>
            {strengthLabel}
          </p>
        </div>
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
      onToggle={() => setShowConfirmPassword(v => !v)}
      showPassword={showConfirmPassword}
    />

    <div className="pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2.5
                   bg-orange-500 hover:bg-orange-600 text-white
                   font-black text-[11px] uppercase tracking-[0.15em]
                   py-4 rounded-sm transition-all duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed
                   active:scale-[0.99]"
        style={{ boxShadow: '0 6px 24px rgba(240,90,26,0.30)' }}
      >
        {isLoading
          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <>Create Account <span className="opacity-70">→</span></>
        }
      </button>
    </div>
  </form>
);

/* ─────────────────────────────────────────────────────────────
   DECORATIVE LEFT PANEL
───────────────────────────────────────────────────────────── */
const DecorativePanel = ({ isLogin }) => (
  <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-black">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBanner})` }}
    />
    {/* Layered overlays */}
    <div className="absolute inset-0 bg-black/60" />
    <div className="absolute inset-0"
         style={{ background: 'linear-gradient(110deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.65) 55%, rgba(8,8,8,0.20) 100%)' }} />
    {/* Orange bottom glow */}
    <div className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none"
         style={{ background: 'linear-gradient(to top, rgba(240,90,26,0.14) 0%, transparent 100%)' }} />
    {/* Orange left edge */}
    <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-orange-500" />

    <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full min-h-screen">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-0.5 select-none">
          <span className="text-white text-xl font-black tracking-tight">Gad</span>
          <span className="text-orange-500 text-2xl font-black leading-none">&</span>
          <span className="text-zinc-500 text-xl font-black tracking-tight">gets</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500 hover:text-white transition-colors"
        >
          <RiArrowLeftLine size={12} /> Back to store
        </Link>
      </div>

      {/* Main copy */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-[2px] bg-orange-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
            {isLogin ? 'Welcome back' : 'New member'}
          </p>
        </div>

        <h2 className="font-black text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}>
          {isLogin
            ? <><span>Welcome</span><br /><span>back.</span></>
            : <><span>Smart</span><br /><span>shopping</span><br /><span className="text-orange-500">starts here.</span></>
          }
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
          {isLogin
            ? 'Sign in to access your account, track orders, and unlock exclusive deals.'
            : 'Get KSh 500 off your first order, early access to deals, and loyalty rewards.'
          }
        </p>
      </div>

      {/* Pill tags */}
      <div className="flex flex-wrap gap-2">
        {(isLogin
          ? ['50,000+ orders delivered', 'Same-day shipping', '2-Year warranty']
          : ['KSh 500 off first order', 'Early access to deals', 'Loyalty rewards']
        ).map((pill, i) => (
          <div
            key={pill}
            className="px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 border border-zinc-800 transition-colors hover:border-orange-500/40 hover:text-zinc-200"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                     borderLeftColor: i === 0 ? '#f05a1a' : undefined,
                     borderLeftWidth: i === 0 ? '2px' : undefined }}
          >
            {pill}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN AUTH COMPONENT
───────────────────────────────────────────────────────────── */
const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin]     = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  const [loginData, setLoginData]     = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [signupErrors, setSignupErrors]       = useState({});
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
  const strengthColors = ['', '#f87171', '#fbbf24', '#34d399', '#f05a1a'];

  const handleLoginChange = e => {
    const { name, value } = e.target;
    setLoginData(p => ({ ...p, [name]: value }));
    if (loginErrors[name]) setLoginErrors(p => ({ ...p, [name]: '' }));
    if (error) setError('');
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginData.email)                          errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errs.email  = 'Enter a valid email';
    if (!loginData.password)                       errs.password = 'Password is required';
    else if (loginData.password.length < 6)        errs.password = 'At least 6 characters';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/login`, {
        email: loginData.email, password: loginData.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.is_admin ? '/admin-dashboard' : '/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupChange = e => {
    const { name, value } = e.target;
    setSignupData(p => ({ ...p, [name]: value }));
    if (signupErrors[name]) setSignupErrors(p => ({ ...p, [name]: '' }));
    if (error) setError('');
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupData.firstName.trim())                             errs.firstName      = 'First name is required';
    if (!signupData.lastName.trim())                              errs.lastName       = 'Last name is required';
    if (!signupData.email)                                        errs.email          = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email))             errs.email          = 'Enter a valid email';
    if (!signupData.password)                                     errs.password       = 'Password is required';
    else if (signupData.password.length < 8)                      errs.password       = 'At least 8 characters';
    if (signupData.confirmPassword !== signupData.password)       errs.confirmPassword = 'Passwords do not match';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validateSignup()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/register`, {
        firstName: signupData.firstName, lastName: signupData.lastName,
        email: signupData.email,         password: signupData.password,
      });
      alert(res.data.message || 'Registration successful! Please log in.');
      setIsLogin(true);
      setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(v => !v);
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

      {/* ── Right panel ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 lg:px-14 bg-white relative">
        {/* Subtle top orange bar (mobile) */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-[3px] bg-orange-500" />

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex items-baseline gap-0.5 select-none">
              <span className="text-black text-2xl font-black tracking-tight">Gad</span>
              <span className="text-orange-500 text-3xl font-black leading-none">&</span>
              <span className="text-zinc-400 text-2xl font-black tracking-tight">gets</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8 lg:text-left text-center">
            <div className="flex items-center gap-3 mb-3 lg:justify-start justify-center">
              <div className="w-4 h-[2px] bg-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">
                {isLogin ? 'Returning customer' : 'New customer'}
              </p>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-black leading-tight">
              {isLogin ? 'Welcome back.' : 'Join us today.'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-medium">
              {isLogin ? 'Sign in to continue to your account.' : 'Create your account in seconds.'}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3.5 rounded-sm bg-red-50 border border-red-200 border-l-2 border-l-red-500 text-xs font-bold text-red-600 flex items-start gap-2.5">
              <RiAlertLine className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
              {error}
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex mb-8 rounded-sm bg-zinc-100 p-1 gap-1">
            {['Sign In', 'Register'].map((label, i) => {
              const active = isLogin ? i === 0 : i === 1;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { if (!active) toggleForm(); }}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] rounded-sm transition-all duration-200 ${
                    active
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div
            key={isLogin ? 'login' : 'signup'}
            style={{ animation: 'authSlideUp 0.25s cubic-bezier(0.22,0.61,0.36,1) both' }}
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

          {/* Legal */}
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            By continuing you agree to Gad<span className="text-orange-500">&</span>gets's{' '}
            <Link to="/terms"   className="text-black hover:text-orange-500 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-black hover:text-orange-500 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Auth;