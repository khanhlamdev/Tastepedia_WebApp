import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, CheckCircle2, Clock, Flame, Package, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface FoodOrderTrackingPageProps {
  onNavigate: (page: string) => void;
}

export function FoodOrderTrackingPage({ onNavigate }: FoodOrderTrackingPageProps) {
  const [currentStatus, setCurrentStatus] = useState<number>(2); // 0-4

  const order = {
    id: 'FO-2024-0156',
    restaurantName: 'Pho 24 Vietnamese Kitchen',
    restaurantLogo: '🍜',
    estimatedTime: '15 min',
    items: [
      { name: 'Traditional Beef Pho (Large)', quantity: 1, price: 14.99 },
      { name: 'Fresh Spring Rolls', quantity: 2, price: 8.99 },
      { name: 'Vietnamese Iced Coffee', quantity: 1, price: 5.99 },
    ],
    subtotal: 29.97,
    deliveryFee: 0,
    tax: 2.40,
    total: 32.37,
    driver: {
      name: 'Alex Thompson',
      rating: 4.9,
      completedDeliveries: 2450,
      phone: '+1 (555) 123-4567',
      vehicle: 'Honda Civic',
      plate: 'ABC 123',
      photo: 'AT'
    }
  };

  const statusSteps = [
    {
      id: 0,
      label: 'Order Confirmed',
      icon: CheckCircle2,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      time: '2:30 PM',
      description: 'Restaurant received your order'
    },
    {
      id: 1,
      label: 'Preparing Food',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      time: '2:35 PM',
      description: 'Chef is cooking your meal',
      animated: true
    },
    {
      id: 2,
      label: 'Driver Picked Up',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      time: '2:55 PM',
      description: 'Order on the way to you'
    },
    {
      id: 3,
      label: 'Arriving Soon',
      icon: Navigation,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      time: 'Est. 3:10 PM',
      description: 'Driver is nearby'
    },
    {
      id: 4,
      label: 'Delivered',
      icon: CheckCircle2,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      time: '',
      description: 'Enjoy your meal!'
    },
  ];

  const progress = ((currentStatus + 1) / statusSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('restaurants')}
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Order Tracking</h1>
              <p className="text-sm text-muted-foreground">Order #{order.id}</p>
            </div>
            <Badge className="bg-primary text-white">
              <Clock className="w-3 h-3 mr-1" />
              {order.estimatedTime}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* ETA Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-orange-50 to-yellow-50 border-2 border-primary/20">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-primary mb-2">
              {order.estimatedTime}
            </div>
            <p className="text-muted-foreground">Estimated Arrival Time</p>
          </div>
          <Progress value={progress} className="h-2 bg-white/50" />
        </Card>

        {/* Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative">
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, #ddd, #ddd 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ddd, #ddd 1px, transparent 1px, transparent 20px)',
                }}
              ></div>
            </div>

            {/* Driver Location Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Navigation className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-primary/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Restaurant Marker */}
            <div className="absolute top-1/4 left-1/4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-secondary">
                <span className="text-2xl">{order.restaurantLogo}</span>
              </div>
            </div>

            {/* Destination Marker */}
            <div className="absolute bottom-1/4 right-1/4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-blue-500">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            {/* Dotted Line Path */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <path
                d="M 25% 25% Q 50% 40% 75% 75%"
                stroke="#FF6B35"
                strokeWidth="3"
                strokeDasharray="10,5"
                fill="none"
                opacity="0.5"
              />
            </svg>

            {/* Map Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-white/95 backdrop-blur-md p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Driver on the way</p>
                    <p className="text-xs text-muted-foreground">0.8 km away</p>
                  </div>
                  <Badge className="bg-secondary text-white">On Time</Badge>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6">Order Status</h3>

          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatus;
              const isCurrent = index === currentStatus;

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Connecting Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-6 top-14 w-0.5 h-full -translate-x-1/2 ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                    ></div>
                  )}

                  {/* Icon */}
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? step.bgColor : 'bg-muted'
                      } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''} ${
                        step.animated && isCurrent ? 'animate-pulse' : ''
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${isCompleted ? step.color : 'text-muted-foreground'}`}
                      />
                    </div>

                    {/* Fire Animation for Cooking Status */}
                    {step.animated && isCurrent && (
                      <div className="absolute -top-1 -right-1">
                        <span className="text-xl animate-bounce">🔥</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h4
                        className={`font-semibold ${
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {step.time && (
                        <span className="text-sm text-muted-foreground">{step.time}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>

                    {/* Current Status Indicator */}
                    {isCurrent && (
                      <Badge className="mt-2 bg-primary/10 text-primary border-primary">
                        Current Status
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Driver Info */}
        {currentStatus >= 2 && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Your Driver</h3>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <div className="bg-primary text-white flex items-center justify-center h-full w-full text-xl font-bold">
                  {order.driver.photo}
                </div>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-semibold text-lg">{order.driver.name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{order.driver.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{order.driver.completedDeliveries} deliveries</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.driver.vehicle} • {order.driver.plate}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="rounded-full h-11"
                onClick={() => window.open(`tel:${order.driver.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Driver
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 rounded-full h-11"
                onClick={() => onNavigate('chat')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
              {order.restaurantLogo}
            </div>
            <div>
              <h3 className="font-bold">{order.restaurantName}</h3>
              <p className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-muted-foreground text-sm">{item.quantity}x</span>
                  <span className="ml-2 font-medium">{item.name}</span>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-secondary font-medium">
                {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Help Button */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-full"
          onClick={() => onNavigate('chat')}
        >
          Need Help? Contact Support
        </Button>

        {/* Debug Controls (for demo) */}
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-3 text-center">
            Demo Controls (Not visible in production)
          </p>
          <div className="flex gap-2 justify-center">
            {statusSteps.map((step, index) => (
              <Button
                key={step.id}
                onClick={() => setCurrentStatus(index)}
                size="sm"
                variant={currentStatus === index ? 'default' : 'outline'}
                className="rounded-full h-8 text-xs"
              >
                {step.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
