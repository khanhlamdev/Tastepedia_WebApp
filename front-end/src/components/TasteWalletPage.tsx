import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Gift, Plus, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TasteWalletPageProps {
  onNavigate: (page: string) => void;
}

export function TasteWalletPage({ onNavigate }: TasteWalletPageProps) {
  const walletBalance = 50.00;
  const pendingRewards = 12.50;

  const transactions = [
    {
      id: 1,
      type: 'credit',
      title: 'Top Up',
      amount: 25.00,
      date: 'Jan 16, 2026',
      time: '2:30 PM',
      method: 'Credit Card'
    },
    {
      id: 2,
      type: 'debit',
      title: 'Payment for Order #TP-2024-0142',
      amount: -19.44,
      date: 'Jan 16, 2026',
      time: '2:00 PM',
      method: 'TasteWallet'
    },
    {
      id: 3,
      type: 'credit',
      title: 'Cashback Reward',
      amount: 2.50,
      date: 'Jan 15, 2026',
      time: '4:15 PM',
      method: 'Reward'
    },
    {
      id: 4,
      type: 'debit',
      title: 'Payment for Order #TP-2024-0138',
      amount: -32.50,
      date: 'Jan 12, 2026',
      time: '6:45 PM',
      method: 'TasteWallet'
    },
    {
      id: 5,
      type: 'credit',
      title: 'Top Up',
      amount: 50.00,
      date: 'Jan 10, 2026',
      time: '11:00 AM',
      method: 'Credit Card'
    },
  ];

  const vouchers = [
    {
      id: 1,
      title: '$5 Off Your Next Order',
      description: 'Minimum purchase $20',
      points: 500,
      discount: 5,
      expiry: 'Expires: Feb 16, 2026'
    },
    {
      id: 2,
      title: 'Free Delivery',
      description: 'Valid for any order',
      points: 300,
      discount: 0,
      expiry: 'Expires: Feb 28, 2026'
    },
    {
      id: 3,
      title: '$10 Off Premium Recipes',
      description: 'Minimum purchase $30',
      points: 1000,
      discount: 10,
      expiry: 'Expires: Mar 16, 2026'
    },
    {
      id: 4,
      title: '20% Off Next Purchase',
      description: 'Up to $15 discount',
      points: 800,
      discount: 15,
      expiry: 'Expires: Mar 1, 2026'
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">TasteWallet</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-orange-600 text-white p-6 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold">${walletBalance.toFixed(2)}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Pending Rewards</p>
              <p className="text-xl font-semibold">${pendingRewards.toFixed(2)}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm rounded-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Claim
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-white text-primary hover:bg-white/90 rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full"
            >
              Transfer
            </Button>
          </div>
        </Card>

        {/* Quick Top Up Amounts */}
        <div>
          <h3 className="font-semibold mb-3">Quick Top Up</h3>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="hover:bg-primary hover:text-white hover:border-primary"
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl p-1">
            <TabsTrigger value="history" className="rounded-lg">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg">
              Rewards & Vouchers
            </TabsTrigger>
          </TabsList>

          {/* Transaction History */}
          <TabsContent value="history" className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit'
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{transaction.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.time}</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {transaction.method}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'credit'
                        ? 'text-secondary'
                        : 'text-foreground'
                    }`}>
                      {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full rounded-full">
              Load More Transactions
            </Button>
          </TabsContent>

          {/* Rewards & Vouchers */}
          <TabsContent value="rewards" className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Your TastePoints</h3>
                  <p className="text-2xl font-bold text-amber-700">2,450 pts</p>
                </div>
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700">
                  Earn More
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((voucher) => (
                <Card
                  key={voucher.id}
                  className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    {voucher.discount > 0 ? (
                      <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        ${voucher.discount} OFF
                      </div>
                    ) : (
                      <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
                        FREE
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {voucher.points} pts
                    </Badge>
                  </div>

                  <h4 className="font-semibold mb-1">{voucher.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {voucher.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {voucher.expiry}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 rounded-full h-8"
                    >
                      Redeem
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
