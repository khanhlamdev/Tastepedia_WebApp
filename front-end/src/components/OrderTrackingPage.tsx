import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, CheckCircle2, Truck, ShoppingBag, Clock, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  } catch { return ''; }
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <XCircle className="w-16 h-16 text-muted-foreground" />
      <p className="text-muted-foreground">{error || 'Không tìm thấy đơn hàng'}</p>
      <Button onClick={() => navigate('/')}>Về trang chủ</Button>
    </div>
  );

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  // Status badge config
  const statusBadge = {
    PENDING: { label: 'Chờ xác nhận', class: 'bg-amber-500' },
    CONFIRMED: { label: 'Đã xác nhận', class: 'bg-blue-500' },
    SHIPPING: { label: 'Đang giao', class: 'bg-orange-500' },
    DELIVERED: { label: 'Hoàn thành', class: 'bg-green-500' },
    CANCELLED: { label: 'Đã huỷ', class: 'bg-red-500' },
  }[order.status] || { label: order.status, class: 'bg-gray-500' };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Theo dõi đơn hàng</h1>
            <p className="text-xs text-muted-foreground">#{order.id.slice(-8).toUpperCase()} • {order.storeName}</p>
          </div>
          <Badge className={`${statusBadge.class} text-white`}>{statusBadge.label}</Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Cancelled banner */}
        {isCancelled && (
          <Card className="p-5 border-red-200 bg-red-50">
            <div className="flex items-center gap-3 text-red-600">
              <XCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Đơn hàng đã bị huỷ</p>
                <p className="text-sm text-red-500">Liên hệ hỗ trợ nếu bạn cần giúp đỡ.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Shopee-style Timeline */}
        {!isCancelled && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-6">Trạng thái đơn hàng</h3>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const done = currentStep >= idx;
                const active = currentStep === idx;
                const isLast = idx === TIMELINE_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Line + Circle */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done
                        ? active
                          ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-200 scale-110'
                          : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                        }`}>
                        {done && !active ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-12 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-10">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                          {active && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse" />
                              Đang xử lý
                            </span>
                          )}
                        </h4>
                        {done && (
                          <span className="text-xs text-muted-foreground">
                            {active ? formatDateTime(order.updatedAt) : ''}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-0.5 ${done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Order Items */}
        <Card className="p-5">
          <h3 className="font-bold mb-4">Sản phẩm đã đặt</h3>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-muted last:border-0">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" /> {item.name}
                </span>
                <span className="text-muted-foreground">x{item.qty} • {formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          {order.note && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mt-3">📝 {order.note}</p>
          )}
        </Card>

        {/* Payment Summary */}
        <Card className="p-5">
          <h3 className="font-bold mb-4">Tóm tắt thanh toán</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí giao hàng</span>
              <span className="text-green-600 font-medium">MIỄN PHÍ</span>
            </div>
            <div className="flex justify-between pt-3 border-t font-bold text-base">
              <span>Tổng cộng</span>
              <span className="text-[#FF6B35]">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Đặt lúc: {formatDateTime(order.createdAt)}</span>
          </div>
        </Card>

        {/* Cancel button (chỉ khi PENDING) */}
        {order.status === 'PENDING' && (
          <Button
            variant="outline"
            className="w-full rounded-xl border-red-200 text-red-500 hover:bg-red-50"
            onClick={async () => {
              try {
                await axios.put(`${API_URL}/orders/${order.id}/cancel`, {}, { withCredentials: true });
                fetchOrder();
              } catch (e: any) {
                alert(e.response?.data?.error || 'Không thể huỷ đơn');
              }
            }}
          >
            Huỷ đơn hàng
          </Button>
        )}
      </div>
    </div>
  );
}
