import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Banknote, Gift, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';

interface CheckoutPaymentPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPaymentPage({ onNavigate }: CheckoutPaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [useTastePoints, setUseTastePoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tastePointsBalance = 5.20;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onNavigate('tracking');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('checkout-shipping')}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Step 2 of 2: Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-primary rounded-full"></div>
          <div className="flex-1 h-2 bg-primary rounded-full"></div>
        </div>

        {/* Payment Method Selection */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Select Payment Method</h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {/* Credit/Debit Card */}
              <label
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="card" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Credit / Debit Card</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pay securely with your card
                  </p>
                </div>
              </label>

              {/* E-Wallet */}
              <label
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="wallet" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">E-Wallet (QR Code)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan QR code to pay
                  </p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="cod" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Cash on Delivery</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pay when you receive your order
                  </p>
                </div>
              </label>
            </div>
          </RadioGroup>
        </Card>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Card Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="mt-2"
                  maxLength={19}
                />
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="mt-2"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    className="mt-2"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="save-card" />
                <label
                  htmlFor="save-card"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Save this card for future purchases
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* E-Wallet QR Code */}
        {paymentMethod === 'wallet' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-center">Scan QR Code to Pay</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scan with your wallet app
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Total Amount: <span className="font-bold text-primary text-lg">$19.44</span>
            </p>
          </Card>
        )}

        {/* TastePoints Toggle */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Use TastePoints</h4>
                <p className="text-sm text-muted-foreground">
                  Available balance: <span className="font-bold text-amber-700">${tastePointsBalance.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <Switch
              checked={useTastePoints}
              onCheckedChange={setUseTastePoints}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
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
            {useTastePoints && (
              <div className="flex justify-between text-amber-700">
                <span>TastePoints Discount</span>
                <span className="font-medium">-${tastePointsBalance.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${(19.44 - (useTastePoints ? tastePointsBalance : 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full h-12 bg-primary hover:bg-primary/90 rounded-full"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Place Order • $${(19.44 - (useTastePoints ? tastePointsBalance : 0)).toFixed(2)}`
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By placing this order, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
