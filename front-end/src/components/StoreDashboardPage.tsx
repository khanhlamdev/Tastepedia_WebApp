import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import {
    ShoppingBag, Clock, CheckCircle2, Truck, XCircle,
    Package, MapPin, Phone, User, RefreshCw, Store,
    LayoutDashboard, Tag, History, LogOut, Plus, Pencil, Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import './StoreDashboardPage.css';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api';

interface OrderItem { name: string; qty: number; price: number; imageUrl?: string; }
interface Order {
    id: string; userId: string; userFullName: string; userPhone: string; userAddress: string;
    storeId: string; storeName: string; items: OrderItem[];
    totalAmount: number; paymentMethod: string; note?: string;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
}

interface StoreProduct {
    id: string; storeId: string; ingredientName: string; displayName: string;
    price: number; unit: string; quantity: number; imageUrl?: string;
}

const STATUS_CONFIG = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    SHIPPING: { label: 'Đang giao', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <Truck className="w-3.5 h-3.5" /> },
    DELIVERED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3.5 h-3.5" /> },
};

function playTingSound() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        [0, 180].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.5, ctx.currentTime + delay / 1000);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay / 1000 + 0.5);
            osc.start(ctx.currentTime + delay / 1000);
            osc.stop(ctx.currentTime + delay / 1000 + 0.6);
        });
    } catch (_) { }
}

function formatTime(iso: string, full = false) {
    try {
        const d = new Date(iso);
        if (full) return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function StoreDashboardPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
    const [activeOrderTab, setActiveOrderTab] = useState('pending');
    const stompClientRef = useRef<Client | null>(null);

    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
    const [formData, setFormData] = useState({ ingredientName: '', displayName: '', price: '', unit: 'kg', quantity: '0' });

    const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();

    useEffect(() => {
        if (!user?.id || user?.role !== 'STORE') {
            navigate('/');
        }
    }, [user, navigate]);

    // Data Fetching
    const fetchData = useCallback(async () => {
        try {
            const [incoming, all, prods] = await Promise.all([
                axios.get(`${API_URL}/orders/store/incoming`, { withCredentials: true }),
                axios.get(`${API_URL}/orders/store/all`, { withCredentials: true }),
                axios.get(`${API_URL}/store-products`, { withCredentials: true }),
            ]);
            setOrders(incoming.data);
            setAllOrders(all.data);
            setProducts(prods.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // WebSocket Configuration
    useEffect(() => {
        if (!user?.storeId) return;
        const wsUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const client = new Client({
            webSocketFactory: () => new SockJS(`${wsUrl}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/store/${user.storeId}/new-order`, (frame) => {
                    const newOrder: Order = JSON.parse(frame.body);
                    playTingSound();
                    toast.success(`🛒 Đơn hàng mới từ ${newOrder.userFullName}!`, {
                        description: `${newOrder.items.length} sản phẩm • ${formatCurrency(newOrder.totalAmount)}`,
                        duration: 8000,
                        action: { label: 'Xem ngay', onClick: () => { setActiveSidebarTab('orders'); setActiveOrderTab('pending'); } },
                    });
                    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
                    setAllOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
                });
            },
        });
        client.activate();
        stompClientRef.current = client;
        return () => { client.deactivate(); };
    }, [user?.storeId]);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.info("Đã đăng xuất tài khoản cửa hàng");
        navigate('/login');
    };

    // Calculate Revenue
    const completedOrders = allOrders.filter(o => o.status === 'DELIVERED');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Update Order Status
    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
            const updatedOrder: Order = res.data;
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            setAllOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            toast.success(`Đơn hàng đã chuyển sang: ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label}`);
        } catch (e: any) {
            toast.error('Cập nhật thất bại: ' + (e.response?.data?.error || e.message));
        }
    };

    // Order Filtering
    const getTabOrders = (tab: string): Order[] => {
        const source = tab === 'history' ? allOrders : orders;
        switch (tab) {
            case 'pending': return source.filter(o => o.status === 'PENDING');
            case 'confirmed': return source.filter(o => o.status === 'CONFIRMED');
            case 'shipping': return source.filter(o => o.status === 'SHIPPING');
            case 'history': return source.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));
            default: return source;
        }
    };
    const tabCount = (tab: string) => getTabOrders(tab).length;

    // Manage Products
    const openProductModal = (prod: StoreProduct | null = null) => {
        if (prod) {
            setEditingProduct(prod);
            setFormData({ ingredientName: prod.ingredientName, displayName: prod.displayName, price: prod.price.toString(), unit: prod.unit, quantity: prod.quantity.toString() });
        } else {
            setEditingProduct(null);
            setFormData({ ingredientName: '', displayName: '', price: '', unit: 'kg', quantity: '0' });
        }
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async () => {
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                quantity: parseInt(formData.quantity, 10) || 0
            };

            if (editingProduct) {
                const res = await axios.put(`${API_URL}/store-products/${editingProduct.id}`, payload, { withCredentials: true });
                setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                const res = await axios.post(`${API_URL}/store-products`, payload, { withCredentials: true });
                setProducts([...products, res.data]);
                toast.success("Thêm sản phẩm thành công");
            }
            setIsProductModalOpen(false);
        } catch (e: any) {
            toast.error('Lỗi lưu sản phẩm: ' + (e.response?.data?.error || e.message));
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
        try {
            await axios.delete(`${API_URL}/store-products/${id}`, { withCredentials: true });
            setProducts(products.filter(p => p.id !== id));
            toast.success("Đã xoá sản phẩm");
        } catch (e: any) {
            toast.error('Lỗi xoá sản phẩm: ' + (e.response?.data?.error || e.message));
        }
    };

    const OrderCard = ({ order }: { order: Order }) => {
        const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
        return (
            <Card className="flex flex-col bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">Đơn #{order.id.slice(-8).toUpperCase()}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                                {cfg.icon} {cfg.label}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">{formatTime(order.createdAt, true)}</p>
                    </div>
                </div>

                {/* Customer Details - Compact */}
                <div className="px-4 py-3 flex flex-col gap-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-800">{order.userFullName}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600">{order.userPhone || 'Chưa cung cấp'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight line-clamp-2">{order.userAddress || 'Chưa cung cấp'}</span>
                    </div>
                </div>

                {/* Order Items */}
                <div className="px-4 py-3 flex-1 bg-gray-50/30">
                    <div className="space-y-3">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div className="flex gap-3 flex-1 min-w-0 pr-4">
                                    <div className="w-12 h-12 rounded border border-gray-200 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'} alt={item.name} className="w-full h-full object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'; }} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</span>
                                        <span className="text-xs text-gray-500 mt-0.5">x{item.qty}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.qty)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {order.note && (
                        <div className="mt-3 bg-amber-50 text-amber-800 text-xs rounded-lg p-2.5 border border-amber-100">
                            <strong className="font-semibold">Chi chú:</strong> {order.note}
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="px-4 py-3 border-t border-gray-100 mt-auto bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Tổng thu ({order.paymentMethod === 'COD' ? 'Tiền mặt' : 'Trả trước'})</span>
                        <span className="text-lg font-bold text-[#FF6B35]">{formatCurrency(order.totalAmount)}</span>
                    </div>

                    <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                            <>
                                <Button className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg h-9 text-sm font-medium shadow-none" onClick={() => updateStatus(order.id, 'CONFIRMED')}>
                                    Nhận đơn
                                </Button>
                                <Button variant="outline" className="rounded-lg h-9 px-3 text-red-500 border-red-200 hover:bg-red-50 shadow-none font-medium" onClick={() => updateStatus(order.id, 'CANCELLED')}>
                                    Từ chối
                                </Button>
                            </>
                        )}
                        {order.status === 'CONFIRMED' && (
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 text-sm font-medium gap-2 shadow-none" onClick={() => updateStatus(order.id, 'SHIPPING')}>
                                <Truck className="w-4 h-4" /> Giao hàng
                            </Button>
                        )}
                        {order.status === 'SHIPPING' && (
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 text-sm font-medium gap-2 shadow-none" onClick={() => updateStatus(order.id, 'DELIVERED')}>
                                <CheckCircle2 className="w-4 h-4" /> Đã giao thành công
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    if (!user?.id || user?.role !== 'STORE') return null;

    const pendingCount = tabCount('pending');

    return (
        <div className="store-dashboard-wrapper">
            {/* Sidebar */}
            <aside className="store-dashboard-sidebar">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-sm">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-tight">Tastepedia</h2>
                        <p className="text-xs text-gray-500">Store Manager</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button onClick={() => setActiveSidebarTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSidebarTab === 'overview' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Tổng quan
                    </button>
                    <button onClick={() => setActiveSidebarTab('orders')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSidebarTab === 'orders' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3"><ShoppingBag className="w-5 h-5" /> Đơn hàng</div>
                        {pendingCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
                    </button>
                    <button onClick={() => setActiveSidebarTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSidebarTab === 'products' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Tag className="w-5 h-5" /> Sản phẩm
                    </button>
                    <button onClick={() => setActiveSidebarTab('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSidebarTab === 'transactions' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <History className="w-5 h-5" /> Lịch sử Giao dịch
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {user.fullName?.charAt(0) || 'S'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="store-dashboard-main">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate pr-2">
                        {activeSidebarTab === 'overview' && 'Tổng quan cửa hàng'}
                        {activeSidebarTab === 'orders' && 'Quản lý Đơn hàng'}
                        {activeSidebarTab === 'products' && 'Quản lý Sản phẩm'}
                        {activeSidebarTab === 'transactions' && 'Lịch sử Giao dịch'}
                    </h1>
                    <Button variant="outline" size="sm" className="rounded-xl gap-2 flex-shrink-0" onClick={fetchData}>
                        <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Báo cáo mới</span>
                    </Button>
                </header>

                <div className="store-dashboard-content">
                    {loading ? (
                        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <>
                            {/* TAB: OVERVIEW */}
                            {activeSidebarTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="p-6 rounded-2xl shadow-sm border-0 bg-gradient-to-br from-[#FF6B35] to-[#ff8c61] text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium opacity-90 mb-1">Tổng doanh thu</p>
                                                    <h2 className="text-3xl font-bold">{formatCurrency(totalRevenue)}</h2>
                                                    <p className="text-xs opacity-75 mt-2">Dựa trên {completedOrders.length} đơn hoàn thành</p>
                                                </div>
                                                <div className="p-3 bg-white/20 rounded-xl"><History className="w-6 h-6" /></div>
                                            </div>
                                        </Card>
                                        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Đơn hàng mới</p>
                                                    <h2 className="text-3xl font-bold text-gray-900">{pendingCount}</h2>
                                                    <p className="text-xs text-gray-500 mt-2">Cần xác nhận ngay</p>
                                                </div>
                                                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><ShoppingBag className="w-6 h-6" /></div>
                                            </div>
                                        </Card>
                                        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Sản phẩm đang bán</p>
                                                    <h2 className="text-3xl font-bold text-gray-900">{products.length}</h2>
                                                    <p className="text-xs text-gray-500 mt-2">{products.filter(p => p.quantity > 0).length} sản phẩm còn hàng</p>
                                                </div>
                                                <div className="p-3 bg-[#4CAF50]/10 rounded-xl text-[#4CAF50]"><Tag className="w-6 h-6" /></div>
                                            </div>
                                        </Card>
                                    </div>

                                    <h3 className="text-lg font-bold mt-8 mb-4">Hoạt động gần đây</h3>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden">
                                        {allOrders.slice(0, 5).map((order) => {
                                            const isComplete = order.status === 'DELIVERED';
                                            return (
                                                <div key={order.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-full ${isComplete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">Đơn hàng #{order.id.slice(-6).toUpperCase()}</p>
                                                            <p className="text-xs text-gray-500">{formatTime(order.createdAt, true)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-medium ${isComplete ? 'text-green-600' : 'text-gray-900'}`}>{isComplete ? '+' : ''}{formatCurrency(order.totalAmount)}</p>
                                                        <p className="text-xs text-gray-500">{STATUS_CONFIG[order.status].label}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {allOrders.length === 0 && <p className="p-8 text-center text-gray-500">Chưa có hoạt động nào</p>}
                                    </div>
                                </div>
                            )}

                            {/* TAB: ORDERS */}
                            {activeSidebarTab === 'orders' && (
                                <div className="space-y-6">
                                    <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
                                        <TabsList className="flex overflow-x-auto whitespace-nowrap bg-white border rounded-xl p-1 mb-6 shadow-sm justify-start md:grid md:grid-cols-4 w-full">
                                            {[
                                                { value: 'pending', label: 'Chờ xác nhận', count: tabCount('pending') },
                                                { value: 'confirmed', label: 'Đã nhận', count: tabCount('confirmed') },
                                                { value: 'shipping', label: 'Đang giao', count: tabCount('shipping') },
                                            ].map(tab => (
                                                <TabsTrigger key={tab.value} value={tab.value} className="flex-shrink-0 whitespace-nowrap rounded-lg text-sm flex items-center gap-2 px-3 sm:px-2">
                                                    {tab.label}
                                                    {tab.count > 0 && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab.value === 'pending' ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                                            {tab.count}
                                                        </span>
                                                    )}
                                                </TabsTrigger>
                                            ))}
                                            <TabsTrigger value="history" className="flex-shrink-0 whitespace-nowrap rounded-lg text-sm px-3 sm:px-2">Lịch sử</TabsTrigger>
                                        </TabsList>

                                        {['pending', 'confirmed', 'shipping', 'history'].map(tab => (
                                            <TabsContent key={tab} value={tab} className="mt-6">
                                                {getTabOrders(tab).length === 0
                                                    ? <div className="py-16 text-center text-muted-foreground bg-white rounded-xl border border-dashed border-gray-200">Không có đơn hàng nào trong phân loại này.</div>
                                                    : <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start">
                                                        {getTabOrders(tab).map(order => <OrderCard key={order.id} order={order} />)}
                                                    </div>
                                                }
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            )}

                            {/* TAB: PRODUCTS */}
                            {activeSidebarTab === 'products' && (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <Button className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl gap-2" onClick={() => openProductModal()}>
                                            <Plus className="w-5 h-5" /> Thêm sản phẩm
                                        </Button>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                        <table className="w-full text-left min-w-[800px]">
                                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Id tham chiếu</th>
                                                    <th className="px-6 py-4 font-medium">Tên hiển thị (Tự đặt)</th>
                                                    <th className="px-6 py-4 font-medium">Giá bán</th>
                                                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                                                    <th className="px-6 py-4 font-medium text-right">Phản hồi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {products.map(prod => (
                                                    <tr key={prod.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4"><Badge variant="outline" className="bg-orange-50 text-orange-700">{prod.ingredientName}</Badge></td>
                                                        <td className="px-6 py-4 font-medium">{prod.displayName}</td>
                                                        <td className="px-6 py-4 text-[#FF6B35] font-bold">{formatCurrency(prod.price)} / {prod.unit}</td>
                                                        <td className="px-6 py-4">
                                                            {prod.quantity > 0
                                                                ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle2 className="w-3.5 h-3.5" /> Còn {prod.quantity}</span>
                                                                : <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5" /> Hết hàng</span>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => openProductModal(prod)} className="rounded-lg hover:bg-blue-50 hover:text-blue-600"><Pencil className="w-4 h-4" /></Button>
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(prod.id)} className="rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {products.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                            Bạn chưa bán nguyên liệu nào. Thêm nguyên liệu ngay để liên kết với Công thức của Tastepedia.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: TRANSACTIONS */}
                            {activeSidebarTab === 'transactions' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                        <div className="p-4 md:p-6 border-b border-gray-100 min-w-[800px]">
                                            <h3 className="text-lg font-bold">Tất cả giao dịch</h3>
                                        </div>
                                        <table className="w-full text-left text-sm min-w-[800px]">
                                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Mã đơn</th>
                                                    <th className="px-6 py-4 font-medium">Thời gian</th>
                                                    <th className="px-6 py-4 font-medium">Loại</th>
                                                    <th className="px-6 py-4 font-medium">Phương thức</th>
                                                    <th className="px-6 py-4 font-medium text-right">Số tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {allOrders.filter(o => o.status === 'DELIVERED').map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50 text-gray-900">
                                                        <td className="px-6 py-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                                                        <td className="px-6 py-4 text-gray-500">{formatTime(order.createdAt, true)}</td>
                                                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Doanh thu bán hàng</span></td>
                                                        <td className="px-6 py-4">{order.paymentMethod}</td>
                                                        <td className="px-6 py-4 text-right font-bold text-green-600">+{formatCurrency(order.totalAmount)}</td>
                                                    </tr>
                                                ))}
                                                {allOrders.filter(o => o.status === 'DELIVERED').length === 0 && (
                                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Chưa có giao dịch hoàn thành nào</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Product Modal */}
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm nguyên liệu mới'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Id tham chiếu (Tên Tiếng Anh hoặc Tên gốc trên app) *</label>
                            <Input placeholder="vd: Fish Sauce, Nấm đông cô tươi..." value={formData.ingredientName} onChange={e => setFormData({ ...formData, ingredientName: e.target.value })} />
                            <p className="text-xs text-gray-500">Cần nhập chính xác tên thành phần trong công thức. Ví dụ: "Nấm đông cô tươi".</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên hiển thị tại cửa hàng</label>
                            <Input placeholder="vd: Nấm đông cô tươi loại 1" value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá bán (VND) *</label>
                                <Input type="number" placeholder="25000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đơn vị *</label>
                                <Input placeholder="hộp, gói, kg, bó..." value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số lượng *</label>
                                <Input type="number" min="0" placeholder="0" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Hủy</Button>
                        <Button className="bg-[#FF6B35] hover:bg-[#ff5722] text-white" onClick={handleSaveProduct}>{editingProduct ? 'Cập nhật' : 'Thêm mới'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center h-[65px] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] justify-between" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <button onClick={() => setActiveSidebarTab('overview')} className={`flex-1 flex flex-col items-center justify-center h-full px-1 ${activeSidebarTab === 'overview' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-900'}`}>
                    <LayoutDashboard className="w-[22px] h-[22px] mb-1" />
                    <span className="text-[10px] font-medium leading-tight text-center w-full whitespace-nowrap">Tổng quan</span>
                </button>
                <button onClick={() => setActiveSidebarTab('orders')} className={`flex-1 relative flex flex-col items-center justify-center h-full px-1 ${activeSidebarTab === 'orders' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-900'}`}>
                    <div className="relative mb-1">
                        <ShoppingBag className="w-[22px] h-[22px]" />
                        {pendingCount > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full leading-none">{pendingCount}</span>}
                    </div>
                    <span className="text-[10px] font-medium leading-tight text-center w-full whitespace-nowrap">Đơn hàng</span>
                </button>
                <button onClick={() => setActiveSidebarTab('products')} className={`flex-1 flex flex-col items-center justify-center h-full px-1 ${activeSidebarTab === 'products' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-900'}`}>
                    <Tag className="w-[22px] h-[22px] mb-1" />
                    <span className="text-[10px] font-medium leading-tight text-center w-full whitespace-nowrap">Sản phẩm</span>
                </button>
                <button onClick={() => setActiveSidebarTab('transactions')} className={`flex-1 flex flex-col items-center justify-center h-full px-1 ${activeSidebarTab === 'transactions' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-900'}`}>
                    <History className="w-[22px] h-[22px] mb-1" />
                    <span className="text-[10px] font-medium leading-tight text-center w-full whitespace-nowrap">Giao dịch</span>
                </button>
                <button onClick={handleLogout} className="flex-1 flex flex-col items-center justify-center h-full px-1 text-gray-500 hover:text-red-500">
                    <LogOut className="w-[22px] h-[22px] mb-1" />
                    <span className="text-[10px] font-medium leading-tight text-center w-full whitespace-nowrap">Đăng xuất</span>
                </button>
            </nav>

        </div>
    );
}

// Badge fallback helper for simple tags
function Badge({ children, className, variant = "default" }: any) {
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}
