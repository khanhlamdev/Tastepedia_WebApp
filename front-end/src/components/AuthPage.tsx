'use client';

import React, { useState } from 'react';
import axios from 'axios'; // Import thư viện gọi API
import { Mail, Lock, User, Facebook, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface AuthPageProps {
  onComplete: () => void;
  onNavigate?: (page: string) => void;
}

export function AuthPage({ onComplete, onNavigate }: AuthPageProps) {
  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // --- STATE QUẢN LÝ DỮ LIỆU INPUT ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wantsToBeCreator, setWantsToBeCreator] = useState(false);

  // State xử lý lỗi/loading
  const [isLoading, setIsLoading] = useState(false);

  const handleSkip = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      onComplete();
    }
  };

  // --- HÀM XỬ LÝ ĐĂNG KÝ / ĐĂNG NHẬP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const API_URL = "http://localhost:8080/api/auth";

    try {
      if (!isLogin) {
        // === LOGIC ĐĂNG KÝ (SIGN UP) ===
        // Gọi API Spring Boot mà bạn vừa viết
        await axios.post(`${API_URL}/signup`, {
          fullName: fullName,
          email: email,
          password: password,
          wantsToBeCreator: wantsToBeCreator
        });

        // Nếu thành công:
        alert("🎉 Đăng ký thành công! Hãy đăng nhập ngay.");
        setIsLogin(true); // Chuyển sang tab Đăng nhập
        // Reset form
        setFullName('');
        setPassword('');

      } else {
        // === LOGIC ĐĂNG NHẬP (LOG IN) ===
        const response = await axios.post(`${API_URL}/signin`, {
          email: email,
          password: password
        });

        // Nếu thành công:
        alert(`Chào mừng ${response.data.fullName} quay trở lại!`);
        console.log("User Info:", response.data);

        // Lưu thông tin vào bộ nhớ trình duyệt để dùng sau này
        localStorage.setItem("user", JSON.stringify(response.data));

        // Chuyển hướng vào trang chủ (gọi hàm onComplete)
        onComplete();
      }
    } catch (error: any) {
      console.error("Lỗi:", error);
      // Hiển thị thông báo lỗi từ Backend trả về (nếu có)
      const message = error.response?.data || "Có lỗi xảy ra, vui lòng thử lại!";
      alert("⚠️ Lỗi: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- GIAO DIỆN QUÊN MẬT KHẨU ---
  if (showForgotPassword) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
          <div
              className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1693743387915-7d190a0e636f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGZvb2R8ZW58MXx8fHwxNzY4NTIzMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080')`
              }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/90 to-[#4CAF50]/70 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
              <div className="text-5xl font-bold mb-4">Tastepedia</div>
              <div className="text-2xl font-light">Cook Smarter, Eat Better.</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
            <button
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-4 right-4 px-6 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all hover:scale-105 border border-border hover:border-primary"
            >
              ← Back
            </button>

            <div className="w-full max-w-md">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Password reset link sent!'); setShowForgotPassword(false); }}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]"
                      required
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5722] text-white">
                  Send Reset Link
                </Button>
              </form>
            </div>
          </div>
        </div>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1693743387915-7d190a0e636f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGZvb2R8ZW58MXx8fHwxNzY4NTIzMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080')` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/90 to-[#4CAF50]/70 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="text-5xl font-bold mb-4">Tastepedia</div>
            <div className="text-2xl font-light">Cook Smarter, Eat Better.</div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
          <button onClick={handleSkip} className="absolute top-4 right-4 px-6 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all hover:scale-105 border border-border hover:border-primary">
            Skip / Browse as Guest →
          </button>

          <div className="w-full max-w-md">
            <div className="md:hidden text-center mb-8">
              <div className="text-4xl font-bold text-[#FF6B35] mb-2">Tastepedia</div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
              <p className="text-gray-600">{isLogin ? 'Login to continue' : 'Create your account'}</p>
            </div>

            {/* FORM CHÍNH */}
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Input Full Name (Chỉ hiện khi Sign Up) */}
              {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Full Name"
                        className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)} // Cập nhật state
                        required={!isLogin}
                    />
                  </div>
              )}

              {/* Input Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 h-12 rounded-2xl bg-[#F9F9F9]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Cập nhật state
                    required
                />
              </div>

              {/* Input Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-10 pr-10 h-12 rounded-2xl bg-[#F9F9F9]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Cập nhật state
                    required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Checkbox Creator (Chỉ hiện khi Sign Up) */}
              {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="creator"
                        checked={wantsToBeCreator}
                        onCheckedChange={(checked) => setWantsToBeCreator(checked as boolean)}
                    />
                    <label htmlFor="creator" className="text-sm text-gray-700">I want to be a Creator</label>
                  </div>
              )}

              {/* Forgot Password Link */}
              {isLogin && (
                  <div className="text-right">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-[#FF6B35] hover:underline">
                      Forgot Password?
                    </button>
                  </div>
              )}

              {/* Nút Submit */}
              <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5722] text-white">
                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
              </Button>
            </form>

            {/* Phần login MXH Google/FB giữ nguyên... */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-2xl bg-transparent">Google</Button>
                <Button variant="outline" className="h-12 rounded-2xl bg-transparent">Facebook</Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-[#FF6B35] font-medium hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}