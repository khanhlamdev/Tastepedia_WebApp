import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Store, MapPin, Phone, Clock, User, Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';

const API_URL = 'http://localhost:8080/api';

export function RegisterStorePage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1); // Step 1: Info, Step 2: Account, Step 3: OTP
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        // Store info
        storeName: '',
        address: '',
        phone: '',
        openTime: '07:00',
        closeTime: '22:00',
        description: '',
        // Account info
        ownerFullName: '',
        ownerEmail: '',
        ownerUsername: '',
        ownerPassword: '',
        confirmPassword: '',
        otp: '',
    });

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleNextStep = () => {
        if (!form.storeName || !form.address || !form.phone) {
            toast.error('Vui lòng điền đầy đủ thông tin cửa hàng');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!form.ownerEmail || !form.ownerUsername || !form.ownerPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin tài khoản');
            return;
        }
        if (form.ownerPassword !== form.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        if (form.ownerPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/stores/register`, {
                storeName: form.storeName,
                address: form.address,
                phone: form.phone,
                openTime: form.openTime,
                closeTime: form.closeTime,
                description: form.description,
                ownerFullName: form.ownerFullName,
                ownerEmail: form.ownerEmail,
                ownerUsername: form.ownerUsername,
                ownerPassword: form.ownerPassword,
            });

            toast.success('Đã gửi mã OTP về email!');
            setStep(3); // Chuyển sang bước nhập OTP

        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!form.otp || form.otp.length < 6) {
            toast.error('Vui lòng nhập đủ 6 số OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/stores/verify`, {
                email: form.ownerEmail,
                otp: form.otp
            }, { withCredentials: true });

            localStorage.setItem("user", JSON.stringify(res.data));
            toast.success('Xác thực tài khoản thành công!');
            navigate('/store-dashboard');
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Xác thực thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 flex items-start justify-center pt-10">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-white/70 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#FF6B35]">Đăng ký Cửa hàng</h1>
                        <p className="text-sm text-muted-foreground">Bắt đầu nhận đơn hàng từ Tastepedia</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-1.5 md:gap-3 mb-8 w-full overflow-x-auto pb-2 scrollbar-hide">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${step === s ? 'bg-[#FF6B35] text-white' : step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                {step > s ? '✓' : s}
                            </div>
                            <span className={`text-xs md:text-sm whitespace-nowrap ${step >= s ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {s === 1 ? 'Cửa hàng' : s === 2 ? 'Tài khoản' : 'Xác thực'}
                            </span>
                            {s < 3 && <div className={`w-4 md:w-8 h-0.5 ml-1.5 md:ml-2 rounded-full ${step > s ? 'bg-green-400' : 'bg-muted'}`} />}
                        </div>
                    ))}
                </div>

                <Card className="p-6 rounded-2xl shadow-lg bg-white">
                    {/* ====== STEP 1: Store Info ====== */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Store className="w-5 h-5 text-[#FF6B35]" />
                                <h2 className="font-bold text-lg">Thông tin cửa hàng</h2>
                            </div>

                            <div>
                                <Label htmlFor="storeName">Tên cửa hàng / siêu thị *</Label>
                                <Input
                                    id="storeName" className="mt-1.5" placeholder="VD: WinMart Quận 1"
                                    value={form.storeName} onChange={e => update('storeName', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Địa chỉ đầy đủ *
                                </Label>
                                <Input
                                    id="address" className="mt-1.5"
                                    placeholder="VD: 123 Lê Thánh Tôn, Quận 1, TP.HCM"
                                    value={form.address} onChange={e => update('address', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tọa độ GPS sẽ được tự động xác định từ địa chỉ này.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="phone" className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" /> Số điện thoại *
                                </Label>
                                <Input
                                    id="phone" className="mt-1.5" placeholder="VD: 0905001002"
                                    value={form.phone} onChange={e => update('phone', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="openTime" className="flex items-center gap-1.5 h-5">
                                        <Clock className="w-3.5 h-3.5" /> Giờ mở cửa
                                    </Label>
                                    <Input
                                        id="openTime" type="time" className="mt-1.5"
                                        value={form.openTime} onChange={e => update('openTime', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="closeTime" className="flex items-center h-5">Giờ đóng cửa</Label>
                                    <Input
                                        id="closeTime" type="time" className="mt-1.5"
                                        value={form.closeTime} onChange={e => update('closeTime', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả cửa hàng (tuỳ chọn)</Label>
                                <Textarea
                                    id="description" className="mt-1.5 resize-none" rows={3}
                                    placeholder="Giới thiệu ngắn về cửa hàng của bạn..."
                                    value={form.description} onChange={e => update('description', e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl h-11 mt-2"
                                onClick={handleNextStep}
                            >
                                Tiếp theo →
                            </Button>
                        </div>
                    )}

                    {/* ====== STEP 2: Account Info ====== */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <User className="w-5 h-5 text-[#FF6B35]" />
                                <h2 className="font-bold text-lg">Tài khoản quản lý</h2>
                            </div>
                            <p className="text-sm text-muted-foreground -mt-2">
                                Tài khoản này dùng để đăng nhập vào Store Dashboard.
                            </p>

                            <div>
                                <Label htmlFor="ownerFullName">Họ tên người quản lý</Label>
                                <Input
                                    id="ownerFullName" className="mt-1.5" placeholder="VD: Nguyễn Văn A"
                                    value={form.ownerFullName} onChange={e => update('ownerFullName', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ownerEmail" className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> Email *
                                </Label>
                                <Input
                                    id="ownerEmail" type="email" className="mt-1.5" placeholder="store@example.com"
                                    value={form.ownerEmail} onChange={e => update('ownerEmail', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ownerUsername">Username đăng nhập *</Label>
                                <Input
                                    id="ownerUsername" className="mt-1.5" placeholder="VD: winmart_q1"
                                    value={form.ownerUsername} onChange={e => update('ownerUsername', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ownerPassword" className="flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5" /> Mật khẩu *
                                </Label>
                                <Input
                                    id="ownerPassword" type="password" className="mt-1.5" placeholder="Ít nhất 6 ký tự"
                                    value={form.ownerPassword} onChange={e => update('ownerPassword', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                                <Input
                                    id="confirmPassword" type="password" className="mt-1.5" placeholder="Nhập lại mật khẩu"
                                    value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setStep(1)}>
                                    ← Quay lại
                                </Button>
                                <Button
                                    className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl h-11"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang xử lý...</span>
                                        : 'Tiếp tục →'
                                    }
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ====== STEP 3: OTP Verification ====== */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-5 h-5 text-[#FF6B35]" />
                                <h2 className="font-bold text-lg">Xác thực Email</h2>
                            </div>
                            <p className="text-sm text-muted-foreground -mt-2">
                                Chúng tôi đã gửi một mã OTP gồm 6 số vào email <strong>{form.ownerEmail}</strong>.
                            </p>

                            <div>
                                <Label htmlFor="otp">Mã OTP *</Label>
                                <Input
                                    id="otp" className="mt-1.5 text-center text-lg tracking-widest" placeholder="Nhập 6 số OTP"
                                    value={form.otp} onChange={e => update('otp', e.target.value)}
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setStep(2)}>
                                    ← Quay lại
                                </Button>
                                <Button
                                    className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl h-11"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang xác thực...</span>
                                        : 'Hoàn tất 🎉'
                                    }
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-5">
                    Đã có tài khoản?{' '}
                    <button onClick={() => navigate('/login')} className="text-[#FF6B35] font-medium hover:underline">
                        Đăng nhập
                    </button>
                </p>
            </div>
        </div>
    );
}
