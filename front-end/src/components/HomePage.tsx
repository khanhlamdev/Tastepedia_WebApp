import { useState } from 'react';
import { Search, ShoppingCart, Bell, User, ChefHat, ShoppingBag, Star, Clock, Heart, CheckCircle, Users, Award, TrendingUp, Truck, MessageSquare, Smile, Meh, Frown, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Card } from './ui/card';

interface HomePageProps {
  onNavigate: (page: string, recipeId?: string) => void;
}

// Mock Data for Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    verified: true,
    rating: 5,
    quote: 'Tastepedia saved my dinner party! The ingredients arrived fresh and the recipes were SO easy to follow. My guests thought I was a pro chef! 🎉',
    role: 'Home Chef'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    verified: true,
    rating: 5,
    quote: 'The AI Chef feature is a game-changer! It suggested 5 amazing recipes using the random ingredients in my fridge. No more food waste!',
    role: 'Food Enthusiast'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    avatar: 'ER',
    verified: true,
    rating: 5,
    quote: 'I love the community here! Everyone is so helpful and the recipes are authentic. The delivery is super fast too - got my ingredients in 30 minutes! 🚀',
    role: 'Cooking Student'
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: 'DK',
    verified: true,
    rating: 5,
    quote: 'Best food platform ever! The "Cook vs Order" feature lets me decide based on my schedule. Busy day? Order it. Free evening? Cook it myself! Perfect flexibility.',
    role: 'Busy Professional'
  }
];

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full font-bold">
            {testimonial.avatar}
          </div>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{testimonial.name}</h4>
            {testimonial.verified && (
              <CheckCircle className="w-4 h-4 text-[#4CAF50] fill-[#4CAF50]" />
            )}
          </div>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed flex-1">
        "{testimonial.quote}"
      </p>
    </Card>
  );
}

// Feedback Modal Component
function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (mood: 'sad' | 'neutral' | 'happy') => {
    setSelectedMood(mood);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setSelectedMood(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border-2 border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">How is your experience?</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!submitted ? (
          <>
            <p className="text-gray-600 text-sm mb-6">
              Your feedback helps us improve Tastepedia!
            </p>

            {/* Emoji Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleSubmit('sad')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-red-50 transition-all hover:scale-110 group"
              >
                <Frown className="w-12 h-12 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Not Good</span>
              </button>

              <button
                onClick={() => handleSubmit('neutral')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-yellow-50 transition-all hover:scale-110 group"
              >
                <Meh className="w-12 h-12 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Okay</span>
              </button>

              <button
                onClick={() => handleSubmit('happy')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-green-50 transition-all hover:scale-110 group"
              >
                <Smile className="w-12 h-12 text-[#4CAF50] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Amazing!</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Thank you!</h4>
            <p className="text-gray-600">Your feedback has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const trendingRecipes = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhfGVufDF8fHx8MTc2ODU3NzU3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bún Chả Hà Nội',
      rating: 4.8,
      time: 45,
      price: '$5.00'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Buddha Bowl',
      rating: 4.9,
      time: 20,
      price: '$8.00'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3Njg0ODY3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Pasta Carbonara',
      rating: 4.7,
      time: 30,
      price: '$12.00'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMGRpc2h8ZW58MXx8fHwxNzY4NTI4ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Grilled Ribeye Steak',
      rating: 4.9,
      time: 35,
      price: '$18.00'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Chocolate Lava Cake',
      rating: 5.0,
      time: 25,
      price: '$6.00'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1542666836-03522463be07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXMlMjBjb29raW5nfGVufDF8fHx8MTc2ODU3NzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Pad Thai Noodles',
      rating: 4.6,
      time: 25,
      price: '$7.00'
    },
  ];

  const categories = [
    { icon: '🇻🇳', label: 'Vietnamese', action: 'search' },
    { icon: '🍽️', label: 'Restaurants', action: 'restaurants' },
    { icon: '🥗', label: 'Keto', action: 'search' },
    { icon: '🛒', label: 'Marketplace', action: 'marketplace' },
    { icon: '💬', label: 'Community', action: 'community' },
    { icon: '🍰', label: 'Dessert', action: 'search' },
  ];

  // Trusted Stats Data
  const trustedStats = [
    { icon: Star, label: '4.9/5 App Rating', value: '10,000+ Reviews', color: 'text-[#FFB800]' },
    { icon: Users, label: '500+ Active Chefs', value: 'Expert Community', color: 'text-[#FF6B35]' },
    { icon: Award, label: '10,000+ Recipes', value: 'Always Fresh', color: 'text-[#4CAF50]' },
    { icon: Truck, label: 'Free Shipping', value: 'Orders over $30', color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-[#FF6B35] hidden md:block">Tastepedia</div>
            
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Ingredient or Dish name..."
                className="pl-10 pr-4 h-11 rounded-full bg-[#F9F9F9] border-0"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => onNavigate('cart')}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs border-2 border-background">
                  3
                </Badge>
              </button>
              <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
              >
                <Bell className="w-6 h-6 text-foreground" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs border-2 border-background">
                  2
                </Badge>
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="hidden md:block"
              >
                <Avatar className="h-9 w-9 border-2 border-border hover:border-primary transition-colors">
                  <div className="bg-primary text-white flex items-center justify-center h-full w-full">
                    <User className="w-5 h-5" />
                  </div>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] rounded-3xl p-8 md:p-12 text-white mb-6 shadow-lg">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Don't know what to cook?
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Let AI suggest recipes based on your ingredients
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-white text-[#FF6B35] hover:bg-gray-100 h-12 rounded-full px-6">
              <ChefHat className="w-5 h-5 mr-2" />
              Ask AI Chef
            </Button>
            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 h-12 rounded-full px-6">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Ingredients
            </Button>
          </div>
        </div>

        {/* TRUSTED STATS STRIP - Glassmorphism */}
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg animate-in fade-in duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trustedStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${stat.color}`} />
                <div className="font-bold text-lg md:text-xl text-gray-900">{stat.label}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Explore Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(cat.action)}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105 min-w-[100px]"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* What's in your Fridge Section */}
        <div className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4CAF50]/5 border-2 border-[#4CAF50]/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-2">🥕 What's in your Fridge?</h3>
          <p className="text-gray-600 mb-4">Input your available ingredients and we'll find the perfect recipe</p>
          <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full">
            Start Cooking Smart
          </Button>
        </div>

        {/* Trending Recipes */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending Recipes</h2>
            <button className="text-[#FF6B35] font-medium hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {trendingRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onNavigate('recipe', recipe.id)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                  <Badge className="absolute bottom-3 left-3 bg-[#4CAF50] text-white">
                    {recipe.price}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-left">{recipe.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                      <span className="font-medium">{recipe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time} mins</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS SECTION - "What Foodies Say" */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-semibold text-[#FF6B35]">TRUSTED BY THOUSANDS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Foodies Say</h2>
            <p className="text-gray-600 text-lg">
              Join 10,000+ happy users who transformed their cooking experience
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              onClick={() => onNavigate('community')}
              variant="outline"
              className="h-12 px-8 rounded-full border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all hover:scale-105"
            >
              <Star className="w-5 h-5 mr-2" />
              Read all 2,000+ reviews
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Average rating: <span className="font-bold text-[#FFB800]">4.9/5</span> ⭐
            </p>
          </div>
        </div>
      </div>

      {/* FLOATING FEEDBACK BUTTON */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50 bg-gradient-to-br from-[#FF6B35] to-[#ff5722] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
