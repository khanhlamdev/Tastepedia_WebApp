'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Facebook, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

// 1. Định nghĩa kiểu dữ liệu User để không dùng 'any' nữa
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  username?: string;
  // ... thêm các trường khác nếu backend trả về
}

interface AuthPageProps {
  onComplete: () => void;
  onNavigate?: (page: string) => void;
  initialView?: 'login' | 'signup';
}

export function AuthPage({ onComplete, onNavigate, initialView = 'login' }: AuthPageProps) {
  const API_URL = "http://localhost:8080/api/auth";

  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE DỮ LIỆU ---
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [wantsToBeCreator, setWantsToBeCreator] = useState(false);

  // State riêng cho Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSkip = () => {
    if (onNavigate) onNavigate('home');
    else onComplete();
  };

  // --- HÀM HELPER: LƯU USER VÀO LOCAL STORAGE ---
  const handleAuthSuccess = (userData: UserData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    // Nếu bạn muốn test RecipeManager ngay, có thể hardcode ID tạm thời nếu backend chưa trả về ID
    // if (!userData.id) userData.id = "user123";

    alert(`👋 Chào mừng ${userData.fullName}!`);
    onComplete(); // Chuyển vào trang chính
  };

  // 2. XỬ LÝ GOOGLE LOGIN
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // B1: Lấy thông tin từ Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        // B2: Gửi về Backend (Nhớ backend phải bật withCredentials để nhận cookie session)
        const res = await axios.post(`${API_URL}/google`, {
          email: userInfo.data.email,
          fullName: userInfo.data.name,
          googleId: userInfo.data.sub,
          type: isLogin ? "LOGIN" : "SIGNUP"
        }, { withCredentials: true }); // <--- QUAN TRỌNG: Gửi cookie session

        // B3: Thành công
        handleAuthSuccess(res.data);

      } catch (error: any) {
        console.error("Lỗi Google:", error);
        const message = error.response?.data || "Lỗi kết nối Google";
        alert("⚠️ " + message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => alert('Đăng nhập Google thất bại!'),
  });

  // --- XỬ LÝ SIGNUP / SIGNIN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // === SIGN UP ===
        if (step === 1) {
          if (password !== confirmPassword) {
            alert("⚠️ Mật khẩu xác nhận không khớp!");
            setIsLoading(false);
            return;
          }
          await axios.post(`${API_URL}/signup`, {
            fullName,
            username,
            email,
            password,
            wantsToBeCreator
          });
          alert("✅ Đã gửi mã OTP về email! Vui lòng kiểm tra.");
          setStep(2);
        } else {
          // Verify OTP
          await axios.post(`${API_URL}/verify`, { email, otp });
          alert("🎉 Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay.");
          setIsLogin(true); // Chuyển sang tab đăng nhập
          setStep(1);
          setPassword('');
          setConfirmPassword('');
          setOtp('');
        }
      } else {
        // === SIGN IN ===
        // Thêm withCredentials: true để nhận cookie session từ backend
        const response = await axios.post(`${API_URL}/signin`, { username, password }, { withCredentials: true });

        handleAuthSuccess(response.data);
      }
    } catch (error: any) {
      console.error("Lỗi:", error);
      const message = error.response?.data || "Có lỗi xảy ra, vui lòng thử lại!";
      alert("⚠️ Lỗi: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { alert("Vui lòng nhập Email!"); return; }

    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/forgot-password`, forgotEmail, {
        headers: { 'Content-Type': 'text/plain' }
      });
      alert('✅ Thành công! Hãy kiểm tra email để lấy mật khẩu mới.');
      setShowForgotPassword(false);
      setForgotEmail(''); // Reset field
    } catch (error: any) {
      const message = error.response?.data || "Lỗi kết nối server!";
      alert("⚠️ " + message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1693743387915-7d190a0e636f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGZvb2R8ZW58MXx8fHwxNzY4NTIzMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080')` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/90 to-[#4CAF50]/70 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="text-5xl font-bold mb-4">Tastepedia</div>
            <div className="text-2xl font-light">Recover Password</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
          <button onClick={() => setShowForgotPassword(false)} className="absolute top-4 right-4 px-6 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-full border">← Back</button>
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-8">Enter your email to receive a new password.</p>
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5722] text-white">{isLoading ? 'Sending...' : 'Send New Password'}</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ... (Phần render chính giữ nguyên như cũ) ...
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ... (Phần ảnh bên trái giữ nguyên) ... */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1693743387915-7d190a0e636f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGZvb2R8ZW58MXx8fHwxNzY4NTIzMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080')` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/90 to-[#4CAF50]/70 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-5xl font-bold mb-4">Tastepedia</div>
          <div className="text-2xl font-light">Cook Smarter, Eat Better.</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
        <button onClick={handleSkip} className="absolute top-4 right-4 px-6 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-full border">Skip / Browse as Guest →</button>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{!isLogin && step === 2 ? 'Verification' : (isLogin ? 'Welcome Back' : 'Get Started')}</h2>
            <p className="text-gray-600">{!isLogin && step === 2 ? 'Enter the OTP sent to your email' : (isLogin ? 'Login to continue' : 'Create your account')}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && step === 2 ? (
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input type="text" placeholder="Enter 6-digit OTP Code" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9] text-center text-lg tracking-widest" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
                <div className="text-center mt-2"><button type="button" onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-[#FF6B35] underline">Change Email / Back</button></div>
              </div>
            ) : (
              <>
                {!isLogin ? (
                  // SIGN UP VIEW
                  <>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="text" placeholder="Full Name" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="text" placeholder="Username (@nickname)" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="email" placeholder="Email" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  </>
                ) : (
                  // LOGIN VIEW - Use Username
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="text" placeholder="Username" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                )}

                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type={showPassword ? 'text' : 'password'} placeholder="Password" className="pl-10 pr-10 h-12 rounded-2xl bg-[#F9F9F9]" value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
                {!isLogin && (<div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="password" placeholder="Confirm Password" className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>)}
                {!isLogin && (<div className="flex items-center space-x-2"><Checkbox id="creator" checked={wantsToBeCreator} onCheckedChange={(c) => setWantsToBeCreator(c as boolean)} /><label htmlFor="creator" className="text-sm text-gray-700">I want to be a Creator</label></div>)}
                {isLogin && (<div className="text-right"><button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-[#FF6B35] hover:underline">Forgot Password?</button></div>)}
              </>
            )}
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5722] text-white transition-all hover:scale-[1.02]">{isLoading ? 'Processing...' : (!isLogin && step === 2 ? 'Verify & Finish' : (isLogin ? 'Log In' : 'Sign Up'))}</Button>
          </form>

          {step === 1 && (
            <div className="mt-6 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setStep(1); }} className="text-sm text-gray-600">{isLogin ? "Don't have an account? " : "Already have an account? "}<span className="text-[#FF6B35] font-medium hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</span></button>
            </div>
          )}

          {/* GOOGLE LOGIN */}
          {step === 1 && (
            <div className="mt-6">
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div></div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl bg-transparent flex items-center justify-center gap-2"
                  onClick={() => handleGoogleLogin()}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </Button>
                <Button variant="outline" className="h-12 rounded-2xl bg-transparent flex items-center justify-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}