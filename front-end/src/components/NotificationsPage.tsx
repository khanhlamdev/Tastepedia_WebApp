import { ArrowLeft, Package, Gift, Users, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const notifications = {
    orders: [
      {
        id: 1,
        title: 'Order Delivered Successfully',
        message: 'Your order #TP-2024-0142 has been delivered',
        time: '10 minutes ago',
        read: false,
        icon: Package,
        color: 'text-secondary'
      },
      {
        id: 2,
        title: 'Driver Assigned',
        message: 'David Chen is on the way with your order',
        time: '25 minutes ago',
        read: false,
        icon: Package,
        color: 'text-primary'
      },
      {
        id: 3,
        title: 'Order Confirmed',
        message: 'Your order #TP-2024-0142 is being prepared',
        time: '1 hour ago',
        read: true,
        icon: Package,
        color: 'text-muted-foreground'
      },
    ],
    promos: [
      {
        id: 4,
        title: '🎉 Flash Sale: 50% Off!',
        message: 'Get 50% off on all premium recipes today only',
        time: '2 hours ago',
        read: false,
        icon: Gift,
        color: 'text-primary'
      },
      {
        id: 5,
        title: 'Weekend Special Offer',
        message: 'Free delivery on orders above $20 this weekend',
        time: '1 day ago',
        read: true,
        icon: Gift,
        color: 'text-muted-foreground'
      },
    ],
    social: [
      {
        id: 6,
        title: 'Chef Minh started following you',
        message: 'Chef Minh is now following your cooking journey',
        time: '3 hours ago',
        read: false,
        icon: Users,
        color: 'text-primary'
      },
      {
        id: 7,
        title: 'New comment on your recipe',
        message: 'Sarah commented: "This looks amazing! Can\'t wait to try it"',
        time: '5 hours ago',
        read: false,
        icon: Users,
        color: 'text-primary'
      },
    ],
  };

  const unreadCount = [...notifications.orders, ...notifications.promos, ...notifications.social]
    .filter(n => !n.read).length;

  const NotificationItem = ({ notification }: { notification: any }) => {
    const Icon = notification.icon;
    
    return (
      <button
        className={`w-full p-4 rounded-xl flex items-start gap-3 hover:bg-muted/50 transition-colors ${
          !notification.read ? 'bg-primary/5' : ''
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          !notification.read ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Icon className={`w-5 h-5 ${notification.color}`} />
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
            {notification.message}
          </p>
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => onNavigate('settings')}
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" className="rounded-full">
            Mark all as read
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Clear all
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted rounded-xl p-1">
            <TabsTrigger value="all" className="rounded-lg">
              All ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg">
              Orders
            </TabsTrigger>
            <TabsTrigger value="promos" className="rounded-lg">
              Promos
            </TabsTrigger>
            <TabsTrigger value="social" className="rounded-lg">
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {[...notifications.orders, ...notifications.promos, ...notifications.social]
              .sort((a, b) => a.id - b.id)
              .reverse()
              .map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </TabsContent>

          <TabsContent value="orders" className="space-y-2">
            {notifications.orders.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="promos" className="space-y-2">
            {notifications.promos.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="social" className="space-y-2">
            {notifications.social.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {unreadCount === 0 && (
          <Card className="p-12 text-center mt-8">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
            <p className="text-muted-foreground">
              No new notifications at the moment
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
