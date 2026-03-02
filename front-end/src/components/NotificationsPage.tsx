import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, Gift, Users, Bell, Settings as SettingsIcon,
  Heart, MessageCircle, CornerDownRight, ShoppingBag, Star, AlertCircle, CheckCheck, Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useNotifications, Notification } from '../hooks/useNotifications';

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

// Chọn icon theo loại thông báo
function getIcon(type: string) {
  switch (type) {
    case 'LIKE_POST':
    case 'LIKE_COMMENT': return <Heart className="w-5 h-5 text-rose-500" />;
    case 'COMMENT_POST': return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case 'REPLY_COMMENT': return <CornerDownRight className="w-5 h-5 text-purple-500" />;
    case 'ORDER': return <Package className="w-5 h-5 text-orange-500" />;
    case 'PROMO': return <Gift className="w-5 h-5 text-green-500" />;
    case 'FOLLOW': return <Users className="w-5 h-5 text-indigo-500" />;
    case 'REWARD': return <Star className="w-5 h-5 text-yellow-500" />;
    case 'SYSTEM': return <AlertCircle className="w-5 h-5 text-gray-500" />;
    default: return <Bell className="w-5 h-5 text-gray-400" />;
  }
}

// Chọn màu nền avatar theo loại thông báo
function getIconBg(type: string) {
  switch (type) {
    case 'LIKE_POST':
    case 'LIKE_COMMENT': return 'bg-rose-100';
    case 'COMMENT_POST': return 'bg-blue-100';
    case 'REPLY_COMMENT': return 'bg-purple-100';
    case 'ORDER': return 'bg-orange-100';
    case 'PROMO': return 'bg-green-100';
    case 'FOLLOW': return 'bg-indigo-100';
    case 'REWARD': return 'bg-yellow-100';
    default: return 'bg-gray-100';
  }
}

// Phân loại thông báo theo tab
function getCategory(type: string): string {
  if (['LIKE_POST', 'LIKE_COMMENT', 'COMMENT_POST', 'REPLY_COMMENT', 'FOLLOW'].includes(type)) return 'social';
  if (['ORDER'].includes(type)) return 'orders';
  if (['PROMO', 'REWARD'].includes(type)) return 'promos';
  return 'system';
}

// Format thời gian tương đối
function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  } catch {
    return '';
  }
}

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const filterByTab = (tab: string): Notification[] => {
    if (tab === 'all') return notifications;
    return notifications.filter((n) => getCategory(n.type) === tab);
  };

  const handleClickNotification = (notification: Notification) => {
    if (!notification.read) {
      markRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleClearAll = async () => {
    await clearAll();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  // --- Notification Item Component ---
  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <button
      onClick={() => handleClickNotification(notification)}
      className={`w-full p-4 rounded-xl flex items-start gap-3 hover:bg-muted/50 transition-colors text-left ${!notification.read ? 'bg-[#FF6B35]/5 border border-[#FF6B35]/10' : ''
        }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={`text-sm leading-snug ${!notification.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
            {notification.message}
          </p>
          {!notification.read && (
            <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
      </div>
    </button>
  );

  // Empty state
  const EmptyState = () => (
    <Card className="p-12 text-center mt-4">
      <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
      <h3 className="text-lg font-bold mb-1">Không có thông báo</h3>
      <p className="text-muted-foreground text-sm">Chưa có thông báo nào trong mục này.</p>
    </Card>
  );

  const tabCounts = {
    all: notifications.filter((n) => !n.read).length,
    social: notifications.filter((n) => !n.read && getCategory(n.type) === 'social').length,
    orders: notifications.filter((n) => !n.read && getCategory(n.type) === 'orders').length,
    promos: notifications.filter((n) => !n.read && getCategory(n.type) === 'promos').length,
    system: notifications.filter((n) => !n.read && getCategory(n.type) === 'system').length,
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
              <h1 className="text-xl font-bold">Thông báo</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} thông báo chưa đọc
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
        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mb-5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full gap-2 text-muted-foreground hover:text-destructive"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <ScrollArea className="w-full" type="scroll">
            <TabsList className="flex w-max gap-1 bg-muted rounded-xl p-1">
              {[
                { value: 'all', label: 'Tất cả', icon: <Bell className="w-3.5 h-3.5" /> },
                { value: 'social', label: 'Cộng đồng', icon: <Users className="w-3.5 h-3.5" /> },
                { value: 'orders', label: 'Đơn hàng', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                { value: 'promos', label: 'Ưu đãi', icon: <Gift className="w-3.5 h-3.5" /> },
                { value: 'system', label: 'Hệ thống', icon: <AlertCircle className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap text-sm"
                >
                  {tab.icon}
                  {tab.label}
                  {tabCounts[tab.value as keyof typeof tabCounts] > 0 && (
                    <Badge className="ml-0.5 h-4 min-w-4 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-[10px] px-1">
                      {tabCounts[tab.value as keyof typeof tabCounts]}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {(['all', 'social', 'orders', 'promos', 'system'] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-2 mt-4">
              {filterByTab(tab).length === 0 ? (
                <EmptyState />
              ) : (
                filterByTab(tab).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
