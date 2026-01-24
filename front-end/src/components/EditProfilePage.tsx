import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Upload, User as UserIcon, Mail, Lock, Shield, Camera,
    Phone, MapPin, FileText, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar } from './ui/avatar';
import { Textarea } from './ui/textarea';

interface EditProfilePageProps {
    onNavigate?: (page: string) => void; // Legacy
}

export function EditProfilePage({ onNavigate }: EditProfilePageProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Profile fields
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [bio, setBio] = useState('');

    // Avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Password Management
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Change Password (Knows Old)
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Forgot Password Flow (OTP)
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // UI States
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

    // Status messages
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // Load user data
    useEffect(() => {
        fetch('http://localhost:8080/api/users/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setFullName(data.fullName || '');
                setUsername(data.username || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setAddress(data.address || '');
                setBio(data.bio || '');
                setAvatarPreview(data.profileImageUrl || null);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error loading profile:', err);
                setIsLoading(false);
            });
    }, []);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;

        setIsUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const res = await fetch('http://localhost:8080/api/users/upload-avatar', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setAvatarPreview(data.imageUrl);
                setAvatarFile(null);
                alert('✅ Cập nhật avatar thành công!');
            } else {
                alert('❌ Lỗi upload avatar');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('❌ Không thể upload avatar');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                // Note: Username/Email sent but backend should verify/ignore if not changeable
                body: JSON.stringify({ fullName, phone, address, bio })
            });

            if (res.ok) {
                setProfileMessage('✅ Cập nhật thông tin thành công!');
                setTimeout(() => setProfileMessage(''), 3000);
            } else {
                const error = await res.text();
                setProfileMessage('❌ ' + error);
            }
        } catch (error) {
            setProfileMessage('❌ Không thể cập nhật thông tin');
        }
    };

    // --- FORGOT PASSWORD (OTP) FLOW ---
    const handleSendOTP = async () => {
        setIsSendingOTP(true);
        try {
            // In real app: use /forgot-password endpoint with email
            const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: email // Send user email
            });

            if (res.ok) {
                setOtpSent(true);
                setPasswordMessage('✅ Mã OTP đã gửi về email của bạn!');
            } else {
                setPasswordMessage('❌ Không thể gửi OTP. Thử lại sau.');
            }
        } catch (error) {
            setPasswordMessage('❌ Lỗi kết nối');
        } finally {
            setIsSendingOTP(false);
        }
    };

    const handleResetPasswordViaOTP = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage('❌ Mật khẩu xác nhận không khớp!');
            return;
        }

        setIsChangingPassword(true);
        try {
            // Mock API call to verify OTP and reset
            // In real app: POST /api/auth/verify-reset-password
            const res = await fetch('http://localhost:8080/api/users/change-password-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, newPassword })
            });

            if (res.ok) {
                alert('✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
                // LOGOUT & REDIRECT TO LOGIN
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setPasswordMessage('❌ OTP sai hoặc hết hạn!');
            }
        } catch (error) {
            setPasswordMessage('❌ Lỗi hệ thống');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // --- REGULAR CHANGE PASSWORD (KNOWS OLD) ---
    const handleChangePasswordNormal = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage('❌ Mật khẩu xác nhận không khớp!');
            return;
        }
        if (!oldPassword) {
            setPasswordMessage('⚠️ Vui lòng nhập mật khẩu hiện tại!');
            return;
        }

        setIsChangingPassword(true);
        try {
            const res = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ oldPassword, newPassword })
            });

            if (res.ok) {
                setPasswordMessage('✅ Đổi mật khẩu thành công!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordMessage(''), 3000);
            } else {
                const txt = await res.text();
                setPasswordMessage('❌ ' + txt);
            }
        } catch (error) {
            setPasswordMessage('❌ Không thể đổi mật khẩu');
        } finally {
            setIsChangingPassword(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-32 md:pb-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] text-white">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 hover:bg-white/10 rounded-full"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold">Chỉnh sửa Profile</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Avatar Section */}
                <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className="bg-orange-50/50 border-b border-orange-100">
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <Camera className="w-5 h-5" />
                            Ảnh đại diện
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-2 ring-orange-100">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="bg-[#FF6B35] text-white flex items-center justify-center h-full w-full text-4xl font-bold">
                                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </Avatar>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-[#FF6B35] text-white rounded-full hover:bg-[#ff5722] shadow-lg transition-transform hover:scale-110"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-600 mb-3 text-sm">
                                    Hỗ trợ định dạng JPG, PNG, GIF. Kích thước tối đa 5MB.
                                </p>
                                {avatarFile && (
                                    <Button onClick={handleUploadAvatar} disabled={isUploadingAvatar} className="bg-[#FF6B35] text-white rounded-full">
                                        {isUploadingAvatar ? 'Đang tải lên...' : 'Lưu ảnh mới'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identity Column */}
                    <Card className="shadow-md border-0 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800"><UserIcon className="w-5 h-5 text-[#FF6B35]" /> Định danh</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-gray-500 text-xs uppercase font-bold">Tên đăng nhập (Read-only)</Label>
                                <div className="relative">
                                    <Input value={username} disabled className="bg-gray-50 text-gray-500 pl-9" />
                                    <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-500 text-xs uppercase font-bold">Email (Read-only)</Label>
                                <div className="relative">
                                    <Input value={email} disabled className="bg-gray-50 text-gray-500 pl-9" />
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="font-medium" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info Column */}
                    <Card className="shadow-md border-0 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800"><Phone className="w-5 h-5 text-[#FF6B35]" /> Thông tin liên hệ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <div className="relative">
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" className="pl-9" />
                                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="address">Địa chỉ / Thành phố</Label>
                                <div className="relative">
                                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Hà Nội, Việt Nam" className="pl-9" />
                                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="bio">Giới thiệu ngắn (Bio)</Label>
                                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Hãy viết đôi dòng về sở thích ăn uống của bạn..." className="min-h-[80px]" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    {profileMessage && <span className={`mr-4 my-auto font-medium ${profileMessage.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{profileMessage}</span>}
                    <Button onClick={handleUpdateProfile} className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-8 h-12 rounded-xl shadow-md text-lg">Lưu thay đổi</Button>
                </div>

                {/* Security Section */}
                <Card className="shadow-lg border-0 border-t-4 border-t-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Lock className="w-5 h-5 text-gray-700" /> Bảo mật & Mật khẩu</span>
                            {!showForgotPassword && (
                                <Button variant="ghost" onClick={() => setShowForgotPassword(true)} className="text-[#FF6B35] text-sm hover:bg-orange-50">
                                    <HelpCircle className="w-4 h-4 mr-1" /> Quên mật khẩu?
                                </Button>
                            )}
                        </CardTitle>
                        <CardDescription>{showForgotPassword ? 'Khôi phục mật khẩu qua Email OTP' : 'Đổi mật khẩu định kỳ để bảo vệ tài khoản'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {showForgotPassword ? (
                            // FORGOT PASSWORD FLOW
                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-orange-800">Khôi phục mật khẩu</h3>
                                    <button onClick={() => setShowForgotPassword(false)} className="text-gray-500 hover:text-gray-700 text-sm">Quay lại</button>
                                </div>

                                {!otpSent ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-600 mb-4">Chúng tôi sẽ gửi mã OTP xác thực đến email: <strong>{email}</strong></p>
                                        <Button onClick={handleSendOTP} disabled={isSendingOTP} className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11">
                                            {isSendingOTP ? 'Đang gửi...' : 'Gửi mã OTP'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Nhập mã OTP (từ email)</Label>
                                            <Input value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center text-xl tracking-widest font-bold bg-white" placeholder="000000" maxLength={6} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Mật khẩu mới</Label>
                                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-white" />
                                            </div>
                                            <div>
                                                <Label>Xác nhận</Label>
                                                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white" />
                                            </div>
                                        </div>
                                        <Button onClick={handleResetPasswordViaOTP} disabled={isChangingPassword} className="w-full bg-[#FF6B35] text-white">
                                            {isChangingPassword ? 'Đang xử lý...' : 'Xác nhận & Đăng nhập lại'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // CHANGE PASSWORD NORMAL FLOW
                            <div className="space-y-4 max-w-2xl mx-auto">
                                <div>
                                    <Label>Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <Input type={showPasswords.old ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                        <button onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                            {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Mật khẩu mới</Label>
                                        <div className="relative">
                                            <Input type={showPasswords.new ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            <button onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Xác nhận mới</Label>
                                        <div className="relative">
                                            <Input type={showPasswords.confirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            <button onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    {passwordMessage && <p className={`text-sm mb-2 font-medium ${passwordMessage.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{passwordMessage}</p>}
                                    <Button onClick={handleChangePasswordNormal} disabled={isChangingPassword} variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-gray-700">
                                        {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
