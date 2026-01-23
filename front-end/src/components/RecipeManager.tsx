'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
    Plus, Image as ImageIcon, Search, Trash2, Clock, ChefHat, DollarSign,
    Calendar, Edit3, Eye, MoreHorizontal, CheckCircle, TrendingUp,
    ShoppingCart, Package, Star, Filter, ChevronDown,
    Upload, Video, FileText, Zap, Globe, Lock, Users,
    BarChart3, Target, TrendingDown, Sparkles, ArrowUpDown, X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

// --- ENHANCED HISTORY DATA ---
const ENHANCED_HISTORY = [
    {
        id: 1,
        title: 'Bún Chả Hà Nội Gia Truyền',
        description: 'Món ăn đặc trưng Hà Nội với thịt nướng thơm lừng',
        date: '2024-02-15',
        status: 'published',
        views: 12050,
        sales: 245,
        revenue: 367.50,
        totalPrice: 15.00,
        image: 'https://images.unsplash.com/photo-1582878826618-d0758830f719?auto=format&fit=crop&w=800',
        rating: 4.8,
        cookTime: '45 phút',
        difficulty: 'Trung bình',
        category: 'Món Việt',
        commission: 12.5,
    },
];

export function RecipeManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-8 bg-[#FF6B35] rounded-full"></div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Recipe <span className="text-[#FF6B35]">Manager</span>
                            </h1>
                            <Badge variant="outline" className="border-orange-200 text-[#FF6B35] bg-orange-50">
                                <Sparkles className="w-3 h-3 mr-1" /> Pro Creator
                            </Badge>
                        </div>
                        <p className="text-gray-600 max-w-2xl">
                            Quản lý công thức, tối ưu doanh thu và theo dõi hiệu suất của bạn trong thời gian thực
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'create' ? 'bg-[#FF6B35] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <Plus className="w-5 h-5" /> <span>Đăng Món Mới</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'history' ? 'bg-[#FF6B35] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <Calendar className="w-5 h-5" /> <span>Lịch Sử & Phân Tích</span>
                            </button>
                        </div>
                        <Button className="gap-2 bg-[#FF6B35] hover:bg-[#E85A20] text-white shadow-lg">
                            <BarChart3 className="w-4 h-4" /> Analytics Dashboard
                        </Button>
                    </div>
                </div>

                {/* QUICK STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard color="#f97316" title="Công thức Active" value="18" sub="+3 tuần này" icon={ChefHat} />
                    <StatCard color="#16a34a" title="Doanh thu tháng" value="$1,245" sub="+24% tăng trưởng" icon={DollarSign} />
                    <StatCard color="#2563eb" title="Tổng lượt xem" value="48.5K" sub="+15% tuần này" icon={Eye} />
                    <StatCard color="#9333ea" title="Đánh giá TB" value="4.7" sub="+0.2 điểm" icon={Star} />
                </div>

                {/* MAIN CONTENT */}
                {activeTab === 'create' ? <EnhancedCreateRecipeForm /> : <EnhancedRecipeHistoryList />}
            </div>
        </div>
    );
}

function StatCard({ color, title, value, sub, icon: Icon }: any) {
    return (
        <Card className="hover:shadow-lg transition-shadow border-none shadow-md text-white" style={{ backgroundColor: color }}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/90">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium bg-white/20 w-fit px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3 text-white" /> <span>{sub}</span>
                </div>
            </CardContent>
        </Card>
    );
}

// --- FORM TẠO CÔNG THỨC ---
function EnhancedCreateRecipeForm() {
    // 1. STATES

    // Ảnh chính
    const [mainImage, setMainImage] = useState<string | null>(null);
    const mainInputRef = useRef<HTMLInputElement>(null);

    // Ảnh phụ
    const [subImages, setSubImages] = useState<string[]>([]);
    const subInputRef = useRef<HTMLInputElement>(null);

    // Nguyên liệu (Tự nhập)
    const [ingredients, setIngredients] = useState([
        { id: 1, name: '', quantity: '', unit: '', price: '' }
    ]);

    // Các bước làm
    const [steps, setSteps] = useState([{ id: Date.now(), content: '' }]);

    // Khác
    const [recipeLevel, setRecipeLevel] = useState(3);
    const [isPremium, setIsPremium] = useState(false);
    const [visibility, setVisibility] = useState('public');

    // 2. HANDLERS

    // Ảnh chính
    const handleMainImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setMainImage(URL.createObjectURL(file));
    };

    // Ảnh phụ
    const handleSubImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && subImages.length < 3) {
            setSubImages([...subImages, URL.createObjectURL(file)]);
        }
        if (e.target) e.target.value = '';
    };

    const removeSubImage = (index: number) => {
        setSubImages(subImages.filter((_, i) => i !== index));
    };

    // Nguyên liệu
    const handleIngredientChange = (id: number, field: string, value: string) => {
        setIngredients(ingredients.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addIngredientRow = () => setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: '', price: '' }]);
    const removeIngredientRow = (id: number) => ingredients.length > 1 && setIngredients(ingredients.filter(item => item.id !== id));

    // Tính toán
    const totalCost = ingredients.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const commission = totalCost * 0.15;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CỘT TRÁI */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="border-b" style={{ backgroundColor: '#FF6B35' }}>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Edit3 className="w-6 h-6 text-white" /> <span>Thông tin Công Thức</span>
                        </CardTitle>
                        <CardDescription className="text-white/80">Tạo công thức mới để chia sẻ với cộng đồng</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold">Tên món ăn <Badge variant="outline" className="text-xs ml-2">Bắt buộc</Badge></Label>
                                <Input placeholder="Ví dụ: Bún Chả Hà Nội..." className="text-lg h-12 border-orange-200 focus:border-orange-400" />
                            </div>
                            <div>
                                <Label className="text-base font-semibold">Mô tả hấp dẫn</Label>
                                <Textarea placeholder="Mô tả hương vị, điểm đặc biệt..." className="min-h-[100px] border-orange-200 focus:border-orange-400" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><Label>Thời gian</Label><Input placeholder="30 phút" className="border-orange-200" /></div>
                                <div><Label>Khẩu phần</Label><Input placeholder="2 người" className="border-orange-200" /></div>
                                <div>
                                    <Label>Độ khó</Label>
                                    <div className="flex gap-2 pt-2 w-full">
                                        {['Dễ', 'Vừa', 'Khó'].map((level, idx) => (
                                            <button
                                                key={level}
                                                onClick={() => setRecipeLevel(idx + 1)}
                                                style={{ backgroundColor: recipeLevel === idx + 1 ? '#FF6B35' : '#F3F4F6', color: recipeLevel === idx + 1 ? '#FFF' : '#4B5563' }}
                                                className="flex-1 py-2 rounded-full text-sm font-bold transition-all shadow-sm"
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />

                        <div className="space-y-4">
                            <Label className="flex items-center gap-2"><FileText className="w-5 h-5"/> Hướng dẫn chi tiết</Label>
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl group relative hover:bg-orange-50/50 transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                    <Textarea
                                        value={step.content}
                                        onChange={(e) => {
                                            const newSteps = [...steps];
                                            newSteps[index].content = e.target.value;
                                            setSteps(newSteps);
                                        }}
                                        placeholder={`Bước ${index + 1}: Mô tả chi tiết...`}
                                        className="flex-1 border-0 bg-transparent focus-visible:ring-0 resize-none min-h-[60px]"
                                    />
                                    {steps.length > 1 && (
                                        <button onClick={() => setSteps(steps.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-white"><Trash2 className="w-5 h-5"/></button>
                                    )}
                                </div>
                            ))}
                            {steps.length < 20 ? (
                                <Button variant="outline" onClick={() => setSteps([...steps, { id: Date.now(), content: '' }])} className="w-full border-dashed text-[#FF6B35] border-orange-200 hover:bg-orange-50 h-12">
                                    <Plus className="w-4 h-4 mr-2"/> Thêm bước mới ({steps.length}/20)
                                </Button>
                            ) : (
                                <p className="text-center text-sm text-red-500 font-medium py-2">Đã đạt giới hạn tối đa 20 bước</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* --- MEDIA UPLOAD --- */}
                <Card className="border-0 shadow-lg">
                    <CardHeader><CardTitle className="flex gap-2"><ImageIcon className="text-orange-600"/> Hình ảnh & Video</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {/* ẢNH CHÍNH */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group overflow-hidden ${mainImage ? 'border-orange-500 bg-orange-50 p-0' : 'border-orange-200 hover:bg-orange-50'}`}
                                onClick={() => !mainImage && mainInputRef.current?.click()}
                            >
                                {mainImage ? (
                                    <>
                                        <img src={mainImage} className="w-full h-64 object-cover" />
                                        <button onClick={(e) => { e.stopPropagation(); setMainImage(null); }} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:bg-white shadow-sm z-10"><Trash2 className="w-5 h-5"/></button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1">Ảnh bìa</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3"><Upload className="w-8 h-8"/></div>
                                        <p className="font-bold text-gray-700">Tải ảnh chính</p>
                                        <p className="text-xs text-orange-500 mt-1">(Bắt buộc tải ảnh chính trước)</p>
                                    </>
                                )}
                                <input type="file" ref={mainInputRef} className="hidden" accept="image/*" onChange={handleMainImageUpload} />
                            </div>

                            {/* VIDEO */}
                            <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:bg-blue-50 cursor-pointer flex flex-col justify-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><Video className="w-8 h-8"/></div>
                                <p className="font-bold text-gray-700">Thêm Video</p>
                            </div>
                        </div>

                        {/* --- ẢNH PHỤ (ĐÃ SỬA NÚT XÓA RÕ RÀNG) --- */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-3">
                                <Label className="text-base font-semibold">Thư viện ảnh phụ</Label>
                                <span className="text-xs text-gray-500">{subImages.length}/3 ảnh</span>
                            </div>

                            <input type="file" ref={subInputRef} className="hidden" accept="image/*" onChange={handleSubImageUpload} />

                            <div className="grid grid-cols-4 gap-3">
                                {[0, 1, 2, 3].map((index) => {
                                    const img = subImages[index];

                                    // 1. Nếu có ảnh -> Hiển thị ảnh + Nút Xóa (GIỐNG ẢNH CHÍNH)
                                    if (img) return (
                                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group hover:border-orange-300 transition-colors">
                                            <img
                                                src={img}
                                                alt={`Sub ${index}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* NÚT XÓA GIỐNG NHƯ ẢNH CHÍNH */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSubImage(index);
                                                }}
                                                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:bg-white hover:text-red-600 shadow-md transition-all z-50"
                                                title="Xóa ảnh này"
                                                type="button"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            {/* Badge số thứ tự */}
                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                                {index + 1}
                                            </div>
                                        </div>
                                    );

                                    // 2. Nếu là ô tiếp theo -> Check điều kiện Ảnh chính
                                    if (index === subImages.length && subImages.length < 3) {
                                        if (!mainImage) {
                                            return (
                                                <div key={index} className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 text-gray-400 cursor-not-allowed">
                                                    <Lock className="w-6 h-6 mb-1 opacity-50" />
                                                    <span className="text-[10px] text-center px-1">Cần ảnh chính</span>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => subInputRef.current?.click()}
                                                className="aspect-square border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 text-orange-500 transition-colors hover:border-orange-400"
                                            >
                                                <Plus className="w-8 h-8" />
                                                <span className="text-xs font-medium mt-1">Thêm ảnh</span>
                                            </div>
                                        );
                                    }

                                    // 3. Các ô còn lại (trống)
                                    return (
                                        <div key={index} className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50/50 text-gray-400">
                                            <span className="text-xs">Trống</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CỘT PHẢI: NGUYÊN LIỆU (TỰ NHẬP) */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FFF7ED' }}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span className="flex gap-2 text-orange-700"><Package className="text-orange-600"/> Nguyên liệu</span>
                            <Badge className="text-white border-0 text-lg px-3 py-1" style={{ backgroundColor: '#FF6B35' }}>${totalCost.toFixed(2)}</Badge>
                        </CardTitle>
                        <CardDescription className="text-orange-800/70">Nhập danh sách nguyên liệu cần thiết</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex gap-2 text-sm font-bold text-orange-800/60 px-1">
                            <div className="flex-1">Tên NL</div>
                            <div className="w-16 text-center">SL</div>
                            <div className="w-16 text-center">ĐV</div>
                            <div className="w-16 text-right">Giá</div>
                            <div className="w-6"></div>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {ingredients.map((item) => (
                                <div key={item.id} className="flex gap-2 items-center">
                                    <Input placeholder="Tên" className="flex-1 bg-white border-orange-200 h-9 text-sm" value={item.name} onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)} />
                                    <Input placeholder="1" type="number" className="w-16 bg-white border-orange-200 h-9 text-sm text-center" value={item.quantity} onChange={(e) => handleIngredientChange(item.id, 'quantity', e.target.value)} />
                                    <Input placeholder="kg" className="w-16 bg-white border-orange-200 h-9 text-sm text-center" value={item.unit} onChange={(e) => handleIngredientChange(item.id, 'unit', e.target.value)} />
                                    <Input placeholder="0" type="number" className="w-16 bg-white border-orange-200 h-9 text-sm text-right font-bold text-orange-600" value={item.price} onChange={(e) => handleIngredientChange(item.id, 'price', e.target.value)} />
                                    <button onClick={() => removeIngredientRow(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" onClick={addIngredientRow} className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50">
                            <Plus className="w-4 h-4 mr-2" /> Thêm dòng
                        </Button>

                        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Tổng chi phí:</span><span className="font-bold">${totalCost.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Hoa hồng (15%):</span><span className="font-bold text-orange-600">${commission.toFixed(2)}</span></div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <div className="flex justify-between w-full items-center">
                            <Label className="flex gap-2 cursor-pointer text-orange-900"><Zap className="text-amber-500"/> Chế độ Premium</Label>
                            <Switch checked={isPremium} onCheckedChange={setIsPremium} />
                        </div>
                        <div className="w-full space-y-2">
                            <Label className="text-orange-900 font-medium">Quyền riêng tư</Label>
                            <div className="flex gap-2">
                                {['public', 'private', 'subscribers'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setVisibility(mode)}
                                        style={{ backgroundColor: visibility === mode ? '#FF6B35' : '#FFF', color: visibility === mode ? '#FFF' : '#4B5563', border: visibility === mode ? 'none' : '1px solid #E5E7EB' }}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                                    >
                                        {mode === 'public' ? 'Công khai' : mode === 'private' ? 'Riêng tư' : 'Đăng ký'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button className="w-full h-12 text-lg font-bold text-white shadow-lg" style={{ backgroundColor: '#FF6B35' }}>
                            <Upload className="w-5 h-5 mr-2" /> Đăng Công Thức
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// --- HISTORY LIST ---
function EnhancedRecipeHistoryList() {
    return (
        <Card className="border-0 shadow-lg overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5"/> Lịch sử bài đăng</h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600 border-0">Tất cả</Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">Đã duyệt</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left py-4 px-6 font-bold text-gray-500 text-sm uppercase">Món ăn</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-500 text-sm uppercase">Ngày đăng</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-500 text-sm uppercase">Trạng thái</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-500 text-sm uppercase">Doanh thu</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-500 text-sm uppercase">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {ENHANCED_HISTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                            <td className="py-4 px-6">
                                <div className="font-bold text-gray-900 text-lg group-hover:text-[#FF6B35] transition-colors">{item.title}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <Eye className="w-3 h-3" /> {item.views}
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {item.rating}
                                </div>
                            </td>
                            <td className="py-4 px-6 text-gray-600 font-medium">{item.date}</td>
                            <td className="py-4 px-6">
                                {item.status === 'published' ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 px-3 py-1"><CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt</Badge>
                                ) : (
                                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0 px-3 py-1"><Clock className="w-3 h-3 mr-1" /> Chờ duyệt</Badge>
                                )}
                            </td>
                            <td className="py-4 px-6 text-right font-bold text-green-600 text-lg">${item.revenue.toFixed(2)}</td>
                            <td className="py-4 px-6 text-right"><Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#FF6B35]"><MoreHorizontal className="w-5 h-5"/></Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}