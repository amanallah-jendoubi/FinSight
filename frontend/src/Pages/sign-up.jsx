import { useState } from "react";
import { Link } from "react-router-dom";

// ─── Sub-components ────────────────────────────────────────────────────────────

const Logo = () => (
  <div className="flex items-center gap-2">
    <span className="text-3xl font-semibold lg:text-white lg:block hidden tracking-tight">FinSight</span>
  </div>
);

const InputField = ({ label, id, type = "text", placeholder, icon, rightIcon, hint, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150
          ${icon ? "pl-10" : "pl-4"} ${rightIcon ? "pr-10" : "pr-4"} py-2.5`}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer select-none">
          {rightIcon}
        </span>
      )}
    </div>
    {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
  </div>
);

const PasswordField = ({ label, id, placeholder, value, onChange, hint }) => {
  const [show, setShow] = useState(false);
  return (
    <InputField
      label={label}
      id={id}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      hint={hint}
      icon={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      }
      rightIcon={
        <span onClick={() => setShow(s => !s)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </span>
      }
    />
  );
};

const GoogleButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-2.5 w-full border border-slate-200 bg-white rounded-xl py-2.5 text-sm font-medium text-slate-700
      hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Continue with Google
  </button>
);

const Divider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-xs text-slate-400 font-medium">or</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);


// ─── Main SignUp page ───────────────────────────────────────────────────────────

export default function SignUp() {
  const [form, setForm] = useState({
    name: "", email: "",  password: ""
  });

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    //submit info
  };

  return (
    <div className="min-h-screen max-h-screen h-screen w-full flex overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100">
      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-indigo-600 p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-white" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[260px] h-[260px] rounded-full bg-white" />
          <div className="absolute top-[40%] right-[10%] w-[140px] h-[140px] rounded-full bg-white" />
        </div>

        <div className="relative z-10">
          <Logo />
          <p className="mt-1 text-indigo-200 text-base tracking-wide">Financial intelligence, simplified.</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Take control of<br />your finances today.
          </h2>
          <div className="space-y-4">
            {[
              { 
                icon: (
                  <svg className="w-5 h-5 stroke-white opacity-90" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ), 
                text: "Real-time spending insights" 
              },
              { 
                icon: (
                  <svg className="w-5 h-5 stroke-white opacity-90" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                ), 
                text: "AI-powered budget forecasting" 
              },
              { 
                icon: (
                  <svg className="w-5 h-5 stroke-white opacity-90" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                ), 
                text: "Instant budget alerts" 
              },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-indigo-100 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-indigo-300 text-[11px]">© {new Date().getFullYear()} FinSight. All rights reserved.</p>
      </div>

      {/* ── Right panel / Form ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-4 flex justify-center">
            <Logo />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-6 py-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Create your account</h1>
              <p className="text-xs text-slate-400 mt-0.5">Join FinSight and start managing your money smarter.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <InputField
                label="Name"
                id="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={set("name")}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />

              {/* Email */}
        
              <InputField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="Enter your email adress"
                  value={form.email}
                  onChange={set("email")}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
              />

              {/* Passwords */}
              <PasswordField
                label="Password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                hint="At least 8 characters with letters and numbers."
              />
              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]
                  text-white font-semibold text-sm rounded-xl py-2.5 transition-all duration-150 shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Create Account
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <Divider />

              <GoogleButton onClick={() => console.log("Google sign up")} />
            </form>

            {/* Login link */}
            <p className="text-center text-xs text-slate-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}