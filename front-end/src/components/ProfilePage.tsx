import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Settings, ChefHat, Trophy, MapPin, Wallet, ChevronRight, MessageCircle, Phone, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface ProfilePageProps {
  onNavigate: (page: string, recipeId?: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/users/profile', { credentials: 'include' })
      .then(async res => {
        if (res.ok) return res.json();
        const text = await res.text();
        throw new Error(text || res.statusText);
      })
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(err.message);
        setIsLoading(false);
      });
  }, []);

  // Use real data, simplified for stats as backend might not return them yet
  const stats = {
    following: 0,
    followers: 0,
    recipesCooked: 0
  };

  const savedRecipes = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhfGVufDF8fHx8MTc2ODU3NzU3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bún Chả Hà Nội',
      time: 45,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3Njg0ODY3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Pasta Carbonara',
      time: 30,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Chocolate Lava Cake',
      time: 25,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Buddha Bowl',
      time: 20,
    },
  ];

  const orderHistory = [
    {
      id: 'TP-2024-0142',
      date: 'Jan 16, 2026',
      items: 4,
      total: 19.44,
      status: 'Delivered'
    },
    {
      id: 'TP-2024-0138',
      date: 'Jan 12, 2026',
      items: 6,
      total: 32.50,
      status: 'Delivered'
    },
    {
      id: 'TP-2024-0125',
      date: 'Jan 8, 2026',
      items: 3,
      total: 15.20,
      status: 'Delivered'
    },
  ];

  const achievements = [
    { icon: '🏆', label: 'Master Chef', desc: 'Cooked 100+ recipes' },
    { icon: '🔥', label: '30 Day Streak', desc: 'Cooked daily for a month' },
    { icon: '⭐', label: 'Top Reviewer', desc: '50+ helpful reviews' },
    { icon: '💚', label: 'Healthy Choice', desc: '25+ healthy meals' },
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading Profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-2">{errorMsg || "Please login to view profile."}</p>
        <Button onClick={() => onNavigate('login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-white text-[#FF6B35] flex items-center justify-center h-full w-full text-3xl font-bold">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user.fullName || user.username}</h2>
                <Badge className="bg-[#FFB800] text-white border-0">
                  <Trophy className="w-3 h-3 mr-1" />
                  {user.role === 'CREATOR' ? 'Creator' : 'Member'}
                </Badge>
              </div>
              <p className="text-white/90 mb-2">{user.email}</p>

              {/* Extra Info: Phone, Address, Bio */}
              <div className="text-sm text-white/80 space-y-1 mb-4">
                {user.phone && <div className="flex items-center justify-center md:justify-start gap-2"><Phone className="w-3 h-3" /> {user.phone}</div>}
                {user.address && <div className="flex items-center justify-center md:justify-start gap-2"><MapPin className="w-3 h-3" /> {user.address}</div>}
                {user.bio && <div className="italic">"{user.bio}"</div>}
              </div>

              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.recipesCooked}</div>
                  <div className="text-sm text-white/80">Recipes Cooked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.following}</div>
                  <div className="text-sm text-white/80">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.followers}</div>
                  <div className="text-sm text-white/80">Followers</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => onNavigate('edit-profile')}
              className="bg-white text-[#FF6B35] hover:bg-white/90 border-0 rounded-full px-6"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="cookbook" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 shadow-md">
            <TabsTrigger value="cookbook" className="rounded-xl data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              <ChefHat className="w-4 h-4 mr-2" />
              Cookbook
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Cookbook Tab */}
          <TabsContent value="cookbook" className="space-y-6">
            {/* Achievements */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-[#FF6B35]/10 to-[#4CAF50]/10 rounded-2xl p-4 text-center border-2 border-[#FF6B35]/20"
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-sm mb-1">{achievement.label}</div>
                    <div className="text-xs text-gray-600">{achievement.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Saved Recipes */}
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Saved Recipes</h3>
                <Badge className="bg-[#4CAF50] text-white">
                  {savedRecipes.length} saved
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => onNavigate('recipe', recipe.id)}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {recipe.title}
                      </h4>
                      <div className="text-white/80 text-xs">{recipe.time} mins</div>
                    </div>
                    <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Order History</h3>

              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-2xl p-4 hover:border-[#FF6B35] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold">Order {order.id}</div>
                        <div className="text-sm text-gray-600">{order.date}</div>
                      </div>
                      <Badge className="bg-[#4CAF50] text-white">{order.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600">{order.items} items</span>
                      <span className="font-bold text-[#FF6B35]">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => onNavigate('tracking')}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full"
                      >
                        Re-order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Account Settings</h3>

              <div className="space-y-1">
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors mb-2 border border-slate-200"
                  >
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span className="flex-1 text-left font-bold text-red-600">Admin Dashboard</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                )}

                <button
                  onClick={() => onNavigate('favorites')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span className="flex-1 text-left font-medium">Yêu thích</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => onNavigate('my-recipes')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <ChefHat className="w-5 h-5 text-[#FF6B35]" />
                  <span className="flex-1 text-left font-medium">Bài đăng của tôi</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <Separator className="my-2" />

                <button
                  onClick={() => onNavigate('wallet')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span className="flex-1 text-left font-medium">TasteWallet & Rewards</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => onNavigate('creator')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <ChefHat className="w-5 h-5 text-gray-600" />
                  <span className="flex-1 text-left font-medium">Creator Studio</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="flex-1 text-left font-medium">Settings & Privacy</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => onNavigate('chat')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="flex-1 text-left font-medium">Help & Support</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-50 border-2 border-red-200 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100 rounded-full"
              >
                Delete Account
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}