import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card } from './ui/card';

interface CheckoutShippingPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutShippingPage({ onNavigate }: CheckoutShippingPageProps) {
  const [deliveryType, setDeliveryType] = useState('now');
  const [selectedAddress, setSelectedAddress] = useState('home');

  const savedAddresses = [
    {
      id: 'home',
      label: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'San Francisco, CA 94102',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'work',
      label: 'Work',
      address: '456 Market Street, Floor 5',
      city: 'San Francisco, CA 94103',
      phone: '+1 (555) 987-6543'
    }
  ];

  const timeSlots = [
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Step 1 of 2: Shipping Details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-primary rounded-full"></div>
          <div className="flex-1 h-2 bg-muted rounded-full"></div>
        </div>

        {/* Map Placeholder */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Delivery Location</h3>
          <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #ddd, #ddd 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ddd, #ddd 1px, transparent 1px, transparent 20px)'
              }}></div>
            </div>
            <div className="relative text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground">Interactive Map</p>
              <p className="text-xs text-muted-foreground">Pin your delivery location</p>
            </div>
          </div>
        </Card>

        {/* Saved Addresses */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Select Address</h3>
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    selectedAddress === addr.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={addr.id} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{addr.label}</h4>
                      {selectedAddress === addr.id && (
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{addr.address}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}</p>
                    <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Edit
                  </Button>
                </label>
              ))}
            </div>
          </RadioGroup>

          <Button variant="outline" className="w-full mt-4 rounded-full">
            <MapPin className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </Card>

        {/* Delivery Time */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">When do you need it?</h3>
          
          <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
            <div className="space-y-3 mb-4">
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  deliveryType === 'now'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="now" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Deliver Now</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimated delivery: 30-45 minutes
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  deliveryType === 'schedule'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="schedule" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Schedule for Later</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your preferred time slot
                  </p>
                </div>
              </label>
            </div>
          </RadioGroup>

          {deliveryType === 'schedule' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="mt-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label>Select Time Slot</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timeSlots.map((slot, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="hover:bg-primary hover:text-white hover:border-primary"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Delivery Instructions */}
        <Card className="p-6">
          <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
          <Input
            id="instructions"
            placeholder="E.g., Ring the doorbell, Leave at door..."
            className="mt-2"
          />
        </Card>

        {/* Order Summary */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">$18.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium text-secondary">FREE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">$1.44</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">$19.44</span>
            </div>
          </div>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={() => onNavigate('checkout-payment')}
          className="w-full h-12 bg-primary hover:bg-primary/90 rounded-full"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
