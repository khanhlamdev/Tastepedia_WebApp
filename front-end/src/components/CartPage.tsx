import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag, Store, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface CartItem {
  id: string; // Tên nguyên liệu
  name: string;
  image: string;
  price: number; // Sẽ được update theo store
  quantity: number;
  recipe: string;
}

interface StoreData {
  id: string;
  name: string;
  address: string;
  distance?: number;
}

interface StoreProduct {
  id: string;
  storeId: string;
  ingredientName: string;
  price: number;
  quantity: number;
}

interface StoreEvaluation {
  store: StoreData;
  availableItemsCount: number;
  totalPrice: number;
  missingItems: string[];
}

export function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [stores, setStores] = useState<StoreData[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<StoreProduct[]>([]);

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    loadCartAndFetchStores();
  }, []);

  const loadCartAndFetchStores = async () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('tastepedia_cart') || '[]');
      setCartItems(savedCart);

      if (savedCart.length > 0) {
        const ingredientNames = Array.from(new Set(savedCart.map((i: CartItem) => i.name)));

        // Fetch stores & products concurrently
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const [storesRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/stores`),
          axios.post(`${API_BASE}/api/store-products/match`, ingredientNames)
        ]);

        setStores(storesRes.data);
        setMatchedProducts(productsRes.data);
      }
    } catch (e) {
      console.error("Failed to load cart data", e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      );
      localStorage.setItem('tastepedia_cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('tastepedia_cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  // Group items by recipe
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.recipe]) acc[item.recipe] = [];
    acc[item.recipe].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Evaluate Stores
  const storeEvaluations: StoreEvaluation[] = stores.map(store => {
    const storeProds = matchedProducts.filter(p => p.storeId === store.id);

    let totalPrice = 0;
    let availableCount = 0;
    const missingItems: string[] = [];

    cartItems.forEach(item => {
      const prod = storeProds.find(p => p.ingredientName === item.name);
      if (prod && prod.quantity >= item.quantity) {
        totalPrice += prod.price * item.quantity;
        availableCount++;
      } else {
        missingItems.push(item.name);
      }
    });

    return {
      store,
      availableItemsCount: availableCount,
      totalPrice,
      missingItems
    };
  }).filter(e => e.availableItemsCount > 0) // Only keep stores that have at least 1 item
    .sort((a, b) => {
      // Sort by most available items first, then by lowest price
      if (b.availableItemsCount !== a.availableItemsCount) {
        return b.availableItemsCount - a.availableItemsCount;
      }
      return a.totalPrice - b.totalPrice;
    });

  // Auto-select best store if not selected
  useEffect(() => {
    if (!selectedStoreId && storeEvaluations.length > 0) {
      setSelectedStoreId(storeEvaluations[0].store.id);
    }
  }, [storeEvaluations, selectedStoreId]);

  const selectedStoreEval = storeEvaluations.find(e => e.store.id === selectedStoreId);
  const subtotal = selectedStoreEval ? selectedStoreEval.totalPrice : 0;
  const shipping = subtotal > 300000 ? 0 : 15000;
  const total = selectedStoreEval ? subtotal + shipping : 0;

  // Render items with correct store price
  const getStorePrice = (itemName: string) => {
    if (!selectedStoreId) return 0;
    const prod = matchedProducts.find(p => p.storeId === selectedStoreId && p.ingredientName === itemName);
    return prod ? prod.price : 0;
  };

  const isItemAvailable = (itemName: string) => {
    if (!selectedStoreEval) return false;
    return !selectedStoreEval.missingItems.includes(itemName);
  };

  const handleCheckout = async () => {
    if (!selectedStoreId || !selectedStoreEval) {
      toast.error("Vui lòng chọn 1 cửa hàng để thanh toán"); return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);

    const availableItems = cartItems
      .filter(item => isItemAvailable(item.name))
      .map(item => ({
        name: item.name,
        qty: item.quantity,
        price: getStorePrice(item.name),
        imageUrl: item.image
      }));

    if (availableItems.length === 0) {
      toast.error("Giỏ hàng của bạn không có sản phẩm nào có sẵn tại cửa hàng này."); return;
    }

    const orderPayload = {
      storeId: selectedStoreId,
      items: availableItems,
      userPhone: user.phone || 'Chưa cung cấp số điện thoại',
      userAddress: user.address || 'Chưa cung cấp địa chỉ giao hàng',
      paymentMethod: 'COD',
      totalAmount: total,
      note: 'Giao trong giờ hành chính'
    };

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.post(`${API_BASE}/api/orders`, orderPayload, { withCredentials: true });
      toast.success("Đặt hàng thành công!");

      // Only keep missing items in the cart
      const remainingCart = cartItems.filter(item => !isItemAvailable(item.name));
      localStorage.setItem('tastepedia_cart', JSON.stringify(remainingCart));

      navigate('/store-dashboard'); // Temporary: Should go to User Tracking Page instead. For demo, we can just send them back to home or a tracking placeholder
    } catch (e: any) {
      toast.error("Đặt hàng thất bại: " + (e.response?.data?.error || e.message));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex-1"><h1 className="text-xl font-bold">Giỏ hàng của bạn</h1><p className="text-sm text-gray-600">{cartItems.length} nguyên liệu</p></div>
          <ShoppingBag className="w-6 h-6 text-[#FF6B35]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-6">Hãy thêm nguyên liệu từ các công thức ngon miệng!</p>
            <Button onClick={() => navigate('/')} className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-8">Khám phá công thức</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Stores & Cart Items */}
            <div className="lg:col-span-2 space-y-6">

              {/* STORE SELECTION */}
              <Card className="bg-white rounded-2xl p-4 md:p-6 shadow-md border-t-4 border-[#FF6B35]">
                <div className="flex items-center gap-2 mb-4">
                  <Store className="w-5 h-5 text-[#FF6B35]" />
                  <h3 className="font-bold text-lg">Chọn Cửa Hàng Giao Chợ</h3>
                </div>

                {storeEvaluations.length === 0 ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    Hiện tại không có cửa hàng nào bán các nguyên liệu trong giỏ hàng của bạn.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {storeEvaluations.map((evalData, idx) => {
                      const isSelected = selectedStoreId === evalData.store.id;
                      const isBest = idx === 0;
                      return (
                        <div
                          key={evalData.store.id}
                          onClick={() => setSelectedStoreId(evalData.store.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900">{evalData.store.name}</h4>
                                {isBest && <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50] text-white text-xs border-0">Khuyên ưu tiên</Badge>}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{evalData.store.address}</p>

                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className={evalData.missingItems.length === 0 ? "border-green-200 text-green-700 bg-green-50" : "border-amber-200 text-amber-700 bg-amber-50"}>
                                  Có sẵn: {evalData.availableItemsCount}/{cartItems.length} món
                                </Badge>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-2">
                              <div className="text-lg font-bold text-[#FF6B35]">{evalData.totalPrice.toLocaleString('vi-VN')} đ</div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-gray-300'}`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* CART ITEMS */}
              {Object.entries(groupedItems).map(([recipeName, items]) => (
                <Card key={recipeName} className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-[#FF6B35]" />
                    <h3 className="font-semibold text-lg">Nguyên liệu cho {recipeName}</h3>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => {
                      const available = isItemAvailable(item.name);
                      const storePrice = getStorePrice(item.name);
                      return (
                        <div key={item.id} className={`flex gap-4 ${!available && selectedStoreId ? 'opacity-50' : ''}`}>
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base mb-1">{item.name}</h4>
                            {selectedStoreId ? (
                              available ? (
                                <p className="text-lg font-bold text-[#FF6B35]">{storePrice.toLocaleString('vi-VN')} đ</p>
                              ) : (
                                <p className="text-sm font-medium text-red-500">Cửa hàng không bán món này</p>
                              )
                            ) : (
                              <p className="text-sm text-gray-500">Đang chờ chọn cửa hàng</p>
                            )}
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>

                            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 mt-2">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-full"><Minus className="w-3 h-3" /></button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-full"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-1">
              <Card className="bg-white rounded-2xl p-6 shadow-lg lg:sticky lg:top-20">
                <h3 className="text-xl font-bold mb-4">Tổng Giỏ Hàng</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính (chỉ tính món có sẵn)</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí giao hàng</span>
                    <span className="font-medium">{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} đ`}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Thành tiền</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">{total.toLocaleString('vi-VN')} đ</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={!selectedStoreId || storeEvaluations.length === 0}
                  className="w-full h-12 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full mb-3"
                >
                  Xác nhận đặt mua
                </Button>

                <p className="text-center text-xs text-gray-500 px-4">
                  Thanh toán bằng tiền mặt khi nhận hàng (COD). Cửa hàng sẽ gọi điện xác nhận đơn.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
