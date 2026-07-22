import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Components/auth/Logo";
import InputField from "../Components/auth/InputField";
import PasswordField from "../Components/auth/PasswordField";
import { signup } from '../api/endpoints/signup';
import { setAxiosAccessToken } from '../api/axiosInstance';


export default function SignUp() {
  const [form, setForm] = useState({
    name: "", email: "",  password: ""
  });
  const [errors, setErrors] = useState ({});
  const navigate = useNavigate();


  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const { accessToken } = response.data;
      setAxiosAccessToken(accessToken); //storing access token in memory 
      navigate("/"); // redirect to home
    } catch (err) {
        if (err.response.data.errors) setErrors(err.response.data.errors); //name || email|| pwd fields either not set properly or misssed
        else setErrors(err.response.data.message); //user already has an account 
      } 
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

            <form onSubmit={handleSubmit} className="space-y-3" noValidate >
              {/* Name */}
              <InputField
                label="Name"
                id="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
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
                  error={errors.email}
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
                error= {errors.password}
                hint="At least 8 characters with letters and numbers."
              />
              {/* Error message */}
                {errors === 'user already has an account' && 
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <p className="text-xs text-red-600">{errors}</p>
                  </div>
                }
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