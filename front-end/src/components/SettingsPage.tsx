'use client';

import { ArrowLeft, User, MapPin, CreditCard, Lock, Globe, Moon, Bell, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

// 1. IMPORT THÊM CÁC THƯ VIỆN CẦN THIẾT
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const API_URL = "http://localhost:8080/api/auth";

  // --- 2. HÀM XỬ LÝ LOGOUT ---
  const handleLogout = async () => {
    try {
      // B1: Gọi API Backend để hủy Session (quan trọng nếu dùng Cookie)
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Lỗi khi gọi API Logout:", error);
      // Dù API lỗi thì vẫn phải xóa client để user thoát ra được
    }

    // B2: Xóa Session Google (nếu có dùng Google Login)
    googleLogout();

    // B3: Xóa thông tin trong Local Storage
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Nếu có lưu token riêng

    // B4: Chuyển hướng về trang Đăng nhập
    onNavigate('auth');
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Personal Information',
          description: 'Update your name, email, and phone',
          action: 'edit'
        },
        {
          icon: MapPin,
          label: 'Address Book',
          description: 'Manage your delivery addresses',
          action: 'edit'
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage cards and payment options',
          action: 'edit'
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification settings',
          action: 'edit'
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English (US)',
          action: 'edit'
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Toggle dark theme',
          action: 'toggle',
          value: false
        },
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          icon: Lock,
          label: 'Change Password',
          description: 'Update your password',
          action: 'edit'
        },
        {
          icon: Lock,
          label: 'Privacy Settings',
          description: 'Manage your privacy preferences',
          action: 'edit'
        },
      ]
    }
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
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {settingsSections.map((section, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;

                    return (
                        <div key={itemIdx}>
                          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>

                            <div className="flex-1 text-left min-w-0">
                              <h4 className="font-semibold text-sm">{item.label}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </p>
                            </div>

                            {item.action === 'toggle' ? (
                                <Switch defaultChecked={item.value} />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>

                          {itemIdx < section.items.length - 1 && (
                              <Separator className="my-1" />
                          )}
                        </div>
                    );
                  })}
                </div>
              </Card>
          ))}

          {/* About Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">About</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </button>
              <Separator />
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Terms of Service</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Privacy Policy</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Help & Support</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </Card>

          {/* Logout Button */}
          <Button
              variant="destructive"
              className="w-full h-12 rounded-full"
              onClick={handleLogout} // 3. GẮN HÀM XỬ LÝ VÀO ĐÂY
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
  );
}