import { ArrowLeft, Phone, MessageCircle, CheckCircle2, Package, Truck, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';

interface OrderTrackingPageProps {
  onNavigate: (page: string) => void;
}

export function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const orderStatus = {
    currentStep: 3,
    steps: [
      { id: 1, label: 'Order Placed', time: '2:30 PM', completed: true },
      { id: 2, label: 'Preparing', time: '2:45 PM', completed: true },
      { id: 3, label: 'Driver Picked Up', time: '3:15 PM', completed: true },
      { id: 4, label: 'Arriving', time: 'Est. 3:42 PM', completed: false },
    ]
  };

  const driver = {
    name: 'David Chen',
    rating: 4.9,
    vehicle: 'Honda Civic',
    plate: 'ABC-1234',
    phone: '+1 (555) 123-4567',
    avatar: 'DC'
  };

  const orderItems = [
    { name: 'Fish Sauce', qty: 1 },
    { name: 'Vermicelli Noodles', qty: 2 },
    { name: 'Grilled Pork Belly', qty: 1 },
    { name: 'Fresh Herbs Mix', qty: 1 },
  ];

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
              <h1 className="text-xl font-bold">Order Tracking</h1>
              <p className="text-sm text-gray-600">Order #TP-2024-0142</p>
            </div>
            <Badge className="bg-[#4CAF50] text-white">On the way</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* ETA Card */}
            <Card className="bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] text-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Arriving Soon!</h2>
                  <p className="text-white/90">Your order is on its way</p>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">12 mins</div>
              <p className="text-white/90">Estimated delivery time</p>
            </Card>

            {/* Map Placeholder */}
            <Card className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#FF6B35] mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">Live tracking coming soon</p>
                </div>
                {/* Simulated route */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M 10 80 Q 30 40, 50 50 T 90 20"
                      stroke="#FF6B35"
                      strokeWidth="0.5"
                      fill="none"
                      strokeDasharray="2,2"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">123 Main Street, Apt 4B</span>
                </div>
                <Button size="sm" variant="ghost" className="text-[#FF6B35]">
                  Edit
                </Button>
              </div>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Order Status</h3>
              <div className="space-y-6">
                {orderStatus.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-[#4CAF50] text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      {index < orderStatus.steps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.completed ? 'bg-[#4CAF50]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-semibold ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <span className="text-sm text-gray-500">{step.time}</span>
                      </div>
                      {step.id === 1 && (
                        <p className="text-sm text-gray-600">
                          Your order has been confirmed and is being processed
                        </p>
                      )}
                      {step.id === 2 && (
                        <p className="text-sm text-gray-600">
                          Restaurant is preparing your ingredients
                        </p>
                      )}
                      {step.id === 3 && (
                        <p className="text-sm text-gray-600">
                          {driver.name} has picked up your order
                        </p>
                      )}
                      {step.id === 4 && (
                        <p className="text-sm text-gray-600">
                          Your order will arrive shortly
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Order Items</h3>
              <div className="space-y-3">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-gray-600">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Driver Card */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg sticky top-20">
              <h3 className="text-lg font-bold mb-4">Your Driver</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <div className="bg-[#FF6B35] text-white flex items-center justify-center h-full w-full text-xl font-bold">
                    {driver.avatar}
                  </div>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{driver.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="text-[#FFB800]">★</span>
                    <span className="font-medium">{driver.rating}</span>
                    <span className="text-gray-400">• 250+ deliveries</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{driver.vehicle}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 font-mono">{driver.plate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 rounded-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat
                </Button>
              </div>
            </Card>

            {/* Help Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 border-2 border-purple-100">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team if you have any questions
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full border-purple-200 hover:bg-purple-100"
              >
                Contact Support
              </Button>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$18.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-[#4CAF50]">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$1.44</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-[#FF6B35]">$19.44</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
