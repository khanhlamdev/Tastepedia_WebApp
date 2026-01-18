import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card } from './ui/card';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  recipe: string;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Fish Sauce',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3Njg1NTA1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 2.50,
      quantity: 1,
      recipe: 'Bún Chả Hà Nội'
    },
    {
      id: '2',
      name: 'Vermicelli Noodles',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3Njg1NTA1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 3.00,
      quantity: 2,
      recipe: 'Bún Chả Hà Nội'
    },
    {
      id: '3',
      name: 'Grilled Pork Belly',
      image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMGRpc2h8ZW58MXx8fHwxNzY4NTI4ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 5.00,
      quantity: 1,
      recipe: 'Bún Chả Hà Nội'
    },
    {
      id: '4',
      name: 'Fresh Herbs Mix',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3Njg1NTA1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 1.50,
      quantity: 1,
      recipe: 'Bún Chả Hà Nội'
    },
    {
      id: '5',
      name: 'Pasta',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3Njg0ODY3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 2.80,
      quantity: 1,
      recipe: 'Pasta Carbonara'
    },
    {
      id: '6',
      name: 'Parmesan Cheese',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3Njg1NTA1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 4.50,
      quantity: 1,
      recipe: 'Pasta Carbonara'
    },
  ]);

  const crossSellItems = [
    { id: 'cs1', name: 'Vietnamese Cinnamon', price: 3.20, image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?w=400' },
    { id: 'cs2', name: 'Star Anise', price: 2.80, image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?w=400' },
    { id: 'cs3', name: 'Chili Oil', price: 4.00, image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?w=400' },
  ];

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const addCrossSellItem = (item: typeof crossSellItems[0]) => {
    const newItem: CartItem = {
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      recipe: 'Add-on Item'
    };
    setCartItems([...cartItems, newItem]);
  };

  // Group items by recipe
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.recipe]) {
      acc[item.recipe] = [];
    }
    acc[item.recipe].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 30 ? 0 : 4.99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Shopping Cart</h1>
              <p className="text-sm text-gray-600">{cartItems.length} items</p>
            </div>
            <ShoppingBag className="w-6 h-6 text-[#FF6B35]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([recipeName, items]) => (
              <Card key={recipeName} className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[#FF6B35]" />
                  <h3 className="font-semibold text-lg">Ingredients for {recipeName}</h3>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base mb-1">{item.name}</h4>
                        <p className="text-lg font-bold text-[#FF6B35]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Cross-sell Section */}
            <Card className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5 rounded-2xl p-4 md:p-6 border-2 border-[#4CAF50]/20">
              <h3 className="font-semibold text-lg mb-3">🌟 You might miss these spices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {crossSellItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                    <p className="text-[#FF6B35] font-bold mb-2">${item.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => addCrossSellItem(item)}
                      className="w-full h-8 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary Card (Desktop Sticky) */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl p-6 shadow-lg sticky top-20">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-[#4CAF50]' : ''}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#4CAF50]">
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[#FF6B35]">${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <div className="mb-4 p-3 bg-[#4CAF50]/10 rounded-xl text-sm text-[#4CAF50] text-center">
                  Add ${(30 - subtotal).toFixed(2)} more for FREE shipping!
                </div>
              )}

              <Button
                onClick={() => onNavigate('tracking')}
                className="w-full h-12 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full mb-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => onNavigate('home')}
                className="w-full h-12 rounded-full"
              >
                Continue Shopping
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-[#4CAF50] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Free delivery on orders over $30</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <div className="w-5 h-5 bg-[#4CAF50] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start adding some delicious ingredients!</p>
            <Button
              onClick={() => onNavigate('home')}
              className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-8"
            >
              Browse Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
