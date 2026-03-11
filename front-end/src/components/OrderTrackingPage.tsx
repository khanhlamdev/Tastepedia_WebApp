import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, CheckCircle2, Truck, ShoppingBag, Clock, XCircle, Navigation, MapPin, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api';

interface OrderItem { name: string; qty: number; price: number; }
interface Order {
  id: string; storeId: string; storeName: string;
  userFullName: string; userAddress: string;
  items: OrderItem[]; totalAmount: number; paymentMethod: string; note?: string;
  status: string; createdAt: string; updatedAt: string;
}

// Mỗi bước timeline với trạng thái trigger tương ứng
const TIMELINE_STEPS = [
  {
    key: 'PENDING',
    label: 'Đặt hàng thành công',
    description: 'Đơn hàng đã được ghi nhận',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    key: 'CONFIRMED',
    label: 'Cửa hàng xác nhận',
    description: 'Đang chuẩn bị hàng cho bạn',
    icon: <Package className="w-5 h-5" />,
  },
  {
    key: 'SHIPPING',
    label: 'Đang giao đến bạn',
    description: 'Shipper đã nhận hàng và đang trên đường',
    icon: <Truck className="w-5 h-5" />,
  },
  {
    key: 'DELIVERED',
    label: 'Giao thành công',
    description: 'Bạn đã nhận hàng. Cảm ơn!',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];

function getStepIndex(status: string) {
  return STATUS_ORDER.indexOf(status);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}



export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await axios.get(`${API_URL}/orders/${orderId}`, { withCredentials: true });
      setOrder(res.data);
    } catch (e: any) {
      setError(e.response?.data || 'Không tìm thấy đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    // Polling mỗi 15s để cập nhật trạng thái real-time
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
      <XCircle className="w-16 h-16 text-muted-foreground" />
      <p className="text-muted-foreground">{error || 'Không tìm thấy đơn hàng'}</p>
      <Button onClick={() => navigate('/')} className="bg-[#FF6B35] hover:bg-[#ff5722] text-white">Về trang chủ</Button>
    </div>
  );

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const progress = isCancelled ? 100 : ((currentStep + 1) / 4) * 100;

  // Cập nhật trạng thái
  const handleMarkAsDelivered = async () => {
    try {
      await axios.put(`${API_URL}/orders/${order.id}/status`, { status: 'DELIVERED' }, { withCredentials: true });
      fetchOrder(); // Gọi lại để update UI
    } catch (e: any) {
      alert(e.response?.data?.error || 'Không thể cập nhật trạng thái');
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    try {
      await axios.put(`${API_URL}/orders/${order.id}/cancel`, {}, { withCredentials: true });
      fetchOrder();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Không thể huỷ đơn');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cinematic Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-105">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">Theo dõi đơn hàng</h1>
              <p className="text-sm text-gray-500">Mã đơn: #{order.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <Badge className="bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium shadow-sm">
            <Clock className="w-3.5 h-3.5 mr-1" /> Dự kiến 30p
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {isCancelled ? (
          <Card className="p-6 border-red-200 bg-red-50/50 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Đơn hàng đã bị huỷ</h3>
                <p className="text-sm text-red-500 mt-1">Giao dịch đã được khoá. Liên hệ hỗ trợ nếu cần giải đáp thêm.</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Map Placeholder Cinematic */}
            <Card className="overflow-hidden rounded-2xl shadow-md border-0 bg-white">
              <div className="aspect-[21/9] md:aspect-[24/9] bg-gradient-to-br from-green-100 via-blue-50 to-orange-50 relative">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, #ddd, #ddd 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ddd, #ddd 1px, transparent 1px, transparent 20px)' }}>
                </div>

                {/* Markers */}
                <div className="absolute top-1/4 left-[20%]">
                  <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-[3px] border-[#FF6B35]">
                    <Store className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">{order.storeName}</div>
                </div>

                <div className="absolute bottom-[20%] right-[20%]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-[3px] border-blue-500">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm text-blue-700">Người nhận</div>
                </div>

                {/* Dotted Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 20 25 Q 50 40 80 80" stroke="#FF6B35" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4,4" fill="none" opacity="0.6" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Floating Progress Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Card className="bg-white/90 backdrop-blur-md p-3 shadow-lg border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        {order.status === 'SHIPPING' ? <Truck className="w-5 h-5 text-[#FF6B35]" /> : <Navigation className="w-5 h-5 text-[#FF6B35]" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">
                          {order.status === 'PENDING' ? 'Cửa hàng đang chuẩn bị món' :
                            order.status === 'SHIPPING' ? 'Tài xế đang giao hàng đến bạn' :
                              order.status === 'DELIVERED' ? 'Giao hàng thành công' : 'Đang xử lý'}
                        </p>
                        <Progress value={progress} className="h-1.5 mt-2 bg-gray-200 [&>div]:bg-[#FF6B35]" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>

            {/* Premium Animated Timeline */}
            <Card className="p-6 rounded-2xl shadow-sm border-0 bg-white">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF6B35]" /> Tiến trình xử lý
              </h3>

              <div className="space-y-0 relative ml-2">
                {/* Connecting background line */}
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gray-100" />

                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  const isLast = idx === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step.key} className="relative flex gap-6 pb-8 last:pb-0">
                      {/* Animated connecting active line */}
                      {!isLast && isCompleted && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-[#FF6B35] origin-top animate-in slide-in-from-top-0 duration-500" />
                      )}

                      {/* Icon Circle */}
                      <div className="relative z-10 shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border-2
                          ${isCompleted ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'bg-white border-gray-200 text-gray-400'}
                          ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}
                        `}>
                          {isCompleted && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                        </div>
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full border-2 border-[#FF6B35] animate-ping opacity-20 scale-150" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pt-1.5 transition-all ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-gray-900">{step.label}</h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Hiện tại
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ACTION: Hoàn thành đơn hàng (Dành cho User) */}
              {(order.status === 'SHIPPING' || order.status === 'CONFIRMED') && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-100">
                    <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4" /> Xác nhận nhận hàng
                    </h4>
                    <p className="text-xs text-orange-700">Vui lòng chỉ ấn nút này sau khi bạn đã kiểm tra và nhận đầy đủ món hàng từ nhân viên giao hàng.</p>
                  </div>
                  <Button
                    onClick={handleMarkAsDelivered}
                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                    className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-green-200 transition-transform active:scale-95 hover:opacity-90"
                  >
                    Tôi đã nhận được hàng
                  </Button>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Canceled Order Action */}
        {order.status === 'PENDING' && !isCancelled && (
          <Button
            variant="outline"
            className="w-full rounded-xl border-red-200 text-red-500 hover:bg-red-50 h-12 font-medium"
            onClick={handleCancelOrder}
          >
            Huỷ đơn hàng
          </Button>
        )}

        {/* Order Items & Invoice */}
        <Card className="p-6 rounded-2xl shadow-sm border-0 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-lg">Hoá đơn điện tử</h3>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-4 mb-4 border border-gray-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start py-3 border-b border-gray-100/80 last:border-0 last:pb-0 relative">
                <div className="flex gap-3">
                  <span className="font-medium text-gray-500 w-5">{item.qty}x</span>
                  <span className="text-gray-900 font-medium pr-4">{item.name}</span>
                </div>
                <span className="text-gray-700 whitespace-nowrap">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          {order.note && (
            <div className="mb-4 bg-amber-50 text-amber-800 text-sm rounded-xl p-3 border border-amber-100">
              <strong className="font-semibold block mb-0.5">Ghi chú cho cửa hàng:</strong> {order.note}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0))}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Phí giao hàng</span>
              <span className="text-green-600 font-medium">Theo thực tế / Freeship</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
              <span className="font-bold text-gray-900">Tổng thanh toán</span>
              <div className="text-right">
                <span className="text-xl font-bold text-[#FF6B35]">{formatCurrency(order.totalAmount)}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{order.paymentMethod === 'COD' ? 'Thanh toán tiền mặt' : 'Thanh toán Online'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
