import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Components/auth/Logo";
import InputField from "../Components/auth/InputField";
import PasswordField from "../Components/auth/PasswordField";
import GoogleButton from "../Components/auth/GoogleButton";
import Divider from "../Components/auth/Divider";
import ForgotPasswordLink from "../Components/auth/ForgotPasswordLink";
import WelcomeBack from "../Components/auth/WelcomeBack";
import {login} from "../api/endpoints/login";
import { useAuth } from "../context/AuthContext";
import { setAxiosAccessToken } from '../api/axiosInstance';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState ({});
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();


  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await login({
        email: form.email,
        password: form.password
      });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      setAxiosAccessToken(accessToken);
      navigate("/");
    }catch (err) {
      if (err.response.data.errors) setErrors(err.response.data.errors); //email|| pwd fields either not set properly or misssed
      else setErrors(err.response.data.message); //please verify your credentials
    }
  };

  return (
    <div className="min-h-screen max-h-screen h-screen w-full flex overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100">
      {/* ── Left panel ── */}
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

        <WelcomeBack/>

        <p className="relative z-10 text-indigo-300 text-[11px]">© {new Date().getFullYear()} FinSight. All rights reserved.</p>
      </div>

      {/* ── Right panel / Form ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-4 flex justify-center">
            <span className="text-3xl font-semibold text-indigo-600 tracking-tight">FinSight</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-6 py-5">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Sign in to your account</h1>
              <p className="text-xs text-slate-400 mt-0.5">Good to have you back. Let's see what's changed.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <InputField
                label="Email"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />

              {/* Password */}
              <div className="space-y-1">
                <PasswordField
                  label="Password"
                  id="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.name}
                />
                <ForgotPasswordLink />
              </div>
              {/* Error message */}
                {errors === 'please verify your credentials' && 

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
                Login
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <Divider />

              <GoogleButton onClick={() => console.log("Google sign in")} />
            </form>

            {/* Sign up link */}
            <p className="text-center text-xs text-slate-400 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}