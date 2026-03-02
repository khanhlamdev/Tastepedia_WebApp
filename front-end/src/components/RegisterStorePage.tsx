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
    const [step, setStep] = useState<1 | 2>(1); // Step 1: Thông tin cửa hàng, Step 2: Tài khoản
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

            // Auto login after successful registration
            try {
                const loginRes = await axios.post(`${API_URL}/auth/signin`, {
                    username: form.ownerUsername,
                    password: form.ownerPassword
                }, { withCredentials: true });

                localStorage.setItem("user", JSON.stringify(loginRes.data));
                toast.success('Đăng ký thành công!');
                navigate('/store-dashboard'); // Auto redirect
            } catch (loginError: any) {
                // If login fails, still show success but they have to login manually
                toast.warning('Đăng ký thành công nhưng tự động đăng nhập thất bại. Vui lòng đăng nhập thủ công.');
                setSuccess(true);
            }

        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    // --- SUCCESS SCREEN ---
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                <Card className="max-w-md w-full p-8 text-center rounded-3xl shadow-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Đăng ký thành công! 🎉</h1>
                    <p className="text-muted-foreground mb-2">
                        Cửa hàng <strong>{form.storeName}</strong> đã được tạo.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Chúng tôi đã gửi thông tin đăng nhập về <strong>{form.ownerEmail}</strong>.
                        Bạn có thể đăng nhập ngay với username <strong>{form.ownerUsername}</strong>.
                    </p>
                    <Button
                        className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl h-11"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập ngay
                    </Button>
                </Card>
            </div>
        );
    }

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
                <div className="flex items-center gap-3 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step === s ? 'bg-[#FF6B35] text-white' : step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                {step > s ? '✓' : s}
                            </div>
                            <span className={`text-sm ${step >= s ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {s === 1 ? 'Thông tin cửa hàng' : 'Tài khoản quản lý'}
                            </span>
                            {s < 2 && <div className={`h-0.5 flex-1 ${step > s ? 'bg-green-400' : 'bg-muted'}`} />}
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
                                        ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang đăng ký...</span>
                                        : 'Hoàn tất đăng ký 🎉'
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
