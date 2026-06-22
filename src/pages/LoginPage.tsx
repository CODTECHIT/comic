import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema, signupSchema, forgotPasswordSchema, otpSchema, resetPasswordSchema } from "../lib/validations";
import { API_URL } from "../config/api";
import { fetchApi } from "../lib/apiClient";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Badge } from "../components/ui/Badge";

export function LoginPage() {
  const navigate = useNavigate();
  const { comics, setProfile } = useAppContext();
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "otp" | "reset">("login");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Track email and OTP across forms
  const [globalEmail, setGlobalEmail] = useState("");
  const [globalOtp, setGlobalOtp] = useState("");

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const { register: signupRegister, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });
  const { register: forgotRegister, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) });
  const { register: otpRegister, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<z.infer<typeof otpSchema>>({ resolver: zodResolver(otpSchema) });
  const { register: resetRegister, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<z.infer<typeof resetPasswordSchema>>({ resolver: zodResolver(resetPasswordSchema) });



  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setError(""); setMsg(""); setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/users/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        localStorage.setItem("token", resData.user.token);
        const { token, ...userWithoutToken } = resData.user;
        localStorage.setItem("user", JSON.stringify(userWithoutToken));
        setProfile({ ...userWithoutToken, token: resData.user.token });
        navigate("/");
      } else setError(resData.message || "Login failed");
    } catch (err: any) { setError(err.message || "Network error. Please try again."); } finally { setLoading(false); }
  };

  const onSignup = async (data: z.infer<typeof signupSchema>) => {
    setError(""); setMsg(""); setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/users/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        if (resData.user) {
          localStorage.setItem("token", resData.user.token);
          const { token, ...userWithoutToken } = resData.user;
          localStorage.setItem("user", JSON.stringify(userWithoutToken));
          setProfile({ ...userWithoutToken, token: resData.user.token });
          navigate("/");
        } else {
          setMode("login");
          setMsg("Account created! Please log in.");
        }
      } else {
        setError(resData.message || "Signup failed");
      }
    } catch (err: any) { setError(err.message || "Network error. Please try again."); } finally { setLoading(false); }
  };

  const onForgot = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setError(""); setMsg(""); setLoading(true);
    try {
      setGlobalEmail(data.email);
      const res = await fetchApi(`${API_URL}/users/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) setMode("otp");
      else setError((await res.json()).message || "Failed to send OTP");
    } catch (err: any) { setError(err.message || "Network error. Please try again."); } finally { setLoading(false); }
  };

  const onOtp = async (data: z.infer<typeof otpSchema>) => {
    setError(""); setMsg(""); setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/users/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: globalEmail, otp: data.otp })
      });
      if (res.ok) {
        setGlobalOtp(data.otp); // save OTP to re-send with reset-password
        setMode("reset");
      }
      else setError((await res.json()).message || "Invalid OTP");
    } catch (err: any) { setError(err.message || "Network error. Please try again."); } finally { setLoading(false); }
  };

  const onReset = async (data: z.infer<typeof resetPasswordSchema>) => {
    setError(""); setMsg(""); setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/users/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        // Include OTP for server-side re-verification (security fix)
        body: JSON.stringify({ email: globalEmail, otp: globalOtp, newPassword: data.password })
      });
      if (res.ok) { setMode("login"); setMsg("Password reset! You can now login."); }
      else setError((await res.json()).message || "Reset failed");
    } catch (err: any) { setError(err.message || "Network error. Please try again."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-16 grid grid-cols-1 lg:grid-cols-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Art side */}
      <div className="hidden lg:block relative bg-[#0D0D0D] overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        {comics && comics[0] && <img src={comics[0].img} alt="Comic art" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #C8181E66 0%, #0D0D0D 70%)" }} />
        <div className="relative h-full flex flex-col justify-end p-12">
          <div className="mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C8181E] border-3 border-[#F5C518] flex items-center justify-center mb-4" style={{ border: "3px solid #F5C518" }}>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "24px", color: "#FFF" }}>Ls</span>
            </div>
            <h2 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "48px", letterSpacing: "0.04em" }}>LEKHYAS STUDIO</h2>
            <p className="text-white/60 mt-2 text-lg">The Lekhyas Universe awaits. 9 titles. Real heroes. Indian mythology meets modern action.</p>
          </div>
          <div className="flex gap-3">
            {["HOT", "NEW", "BUY & WIN"].map(b => <Badge key={b} text={b} variant={b === "NEW" ? "red" : b === "HOT" ? "blue" : "yellow"} />)}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="bg-[#F4EFE0] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="border-4 border-black bg-white p-8" style={{ boxShadow: "8px 8px 0 #0D0D0D" }}>
            <div className="flex mb-6 border-b-4 border-black">
              {(["login", "signup"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setMsg(""); }}
                  className={`flex-1 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${(mode === m || (m === "login" && mode !== "signup")) ? "bg-[#C8181E] text-white" : "bg-transparent text-[#6B5B45] hover:text-[#0D0D0D]"}`}
                  style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.06em" }}>
                  {m === "login" ? "LOGIN" : "SIGN UP"}
                </button>
              ))}
            </div>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm border border-red-300 rounded">{error}</div>}
            {msg && <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm border border-green-300 rounded">{msg}</div>}

            {mode === "login" && (
              <form className="space-y-4" onSubmit={handleLoginSubmit(onLogin)}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Email</label>
                  <input {...loginRegister("email")} type="email" placeholder="you@example.com" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Password</label>
                  <input {...loginRegister("password")} type="password" placeholder="••••••••" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] transition-colors">Forgot password?</button>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2 disabled:opacity-50"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                  {loading ? "PROCESSING..." : "ENTER THE UNIVERSE"}
                </button>
              </form>
            )}

            {mode === "signup" && (
              <form className="space-y-4" onSubmit={handleSignupSubmit(onSignup)}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Username</label>
                  <input {...signupRegister("username")} type="text" placeholder="Hero123" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {signupErrors.username && <p className="text-red-500 text-xs mt-1">{signupErrors.username.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Email</label>
                  <input {...signupRegister("email")} type="email" placeholder="you@example.com" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {signupErrors.email && <p className="text-red-500 text-xs mt-1">{signupErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Mobile Number</label>
                  <input {...signupRegister("mobile")} type="tel" placeholder="+91 XXXXX XXXXX" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {signupErrors.mobile && <p className="text-red-500 text-xs mt-1">{signupErrors.mobile.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Password</label>
                  <input {...signupRegister("password")} type="password" placeholder="••••••••" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {signupErrors.password && <p className="text-red-500 text-xs mt-1">{signupErrors.password.message}</p>}
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2 disabled:opacity-50"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                  {loading ? "PROCESSING..." : "CREATE ACCOUNT"}
                </button>
              </form>
            )}

            {mode === "forgot" && (
              <form className="space-y-4" onSubmit={handleForgotSubmit(onForgot)}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Email</label>
                  <input {...forgotRegister("email")} type="email" placeholder="you@example.com" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {forgotErrors.email && <p className="text-red-500 text-xs mt-1">{forgotErrors.email.message}</p>}
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setMode("login")} className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] transition-colors">Back to Login</button>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2 disabled:opacity-50"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                  {loading ? "PROCESSING..." : "SEND OTP"}
                </button>
              </form>
            )}

            {mode === "otp" && (
              <form className="space-y-4" onSubmit={handleOtpSubmit(onOtp)}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Enter OTP</label>
                  <input {...otpRegister("otp")} type="text" placeholder="6-digit code" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm tracking-widest text-center" />
                  {otpErrors.otp && <p className="text-red-500 text-xs mt-1">{otpErrors.otp.message}</p>}
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setMode("login")} className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] transition-colors">Back to Login</button>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2 disabled:opacity-50"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                  {loading ? "PROCESSING..." : "VERIFY OTP"}
                </button>
              </form>
            )}

            {mode === "reset" && (
              <form className="space-y-4" onSubmit={handleResetSubmit(onReset)}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">New Password</label>
                  <input {...resetRegister("password")} type="password" placeholder="••••••••" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                  {resetErrors.password && <p className="text-red-500 text-xs mt-1">{resetErrors.password.message}</p>}
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setMode("login")} className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] transition-colors">Back to Login</button>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2 disabled:opacity-50"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                  {loading ? "PROCESSING..." : "RESET PASSWORD"}
                </button>
              </form>
            )}
          </div>
          <p className="text-center text-xs text-[#6B5B45] mt-4">
            By continuing, you agree to the <button type="button" onClick={() => navigate("/terms")} className="underline hover:text-[#C8181E]">Terms & Conditions</button> and <button type="button" onClick={() => navigate("/privacy")} className="underline hover:text-[#C8181E]">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
