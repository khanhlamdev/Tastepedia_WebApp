'use client';

import { useState, useEffect } from 'react';
import { Star, Clock, Heart, CheckCircle, Users, Award, TrendingUp, Truck, MessageSquare, Smile, Meh, Frown, X, Utensils, Store, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui//avatar';
import { Card } from './ui//card';
import { Header } from './layout/Header';
import { HeroSlider } from './HeroSlider';
import { Footer } from './layout/Footer';

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

// Categories Data - Main Features Only
const categories = [
  {
    id: 'restaurants',
    label: 'Restaurants',
    image: 'https://res.cloudinary.com/dlqxg5hp0/image/upload/v1769225098/d55b8bf08f4ba29545ef9d3ba236273d_fyl2vx.jpg',
    gradient: 'from-blue-500 to-purple-500',
    count: '50+ Partners',
    description: 'Order from local & chain restaurants',
    iconComponent: <Utensils className="w-8 h-8 text-white" />
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    image: 'https://res.cloudinary.com/dlqxg5hp0/image/upload/v1769224944/Gemini_Generated_Image_8k955t8k955t8k95_ki1ina.png',
    gradient: 'from-yellow-500 to-amber-500',
    count: 'Fresh Ingredients',
    description: 'Get ingredients delivered in 30 minutes',
    iconComponent: <Store className="w-8 h-8 text-white" />
  },
  {
    id: 'community',
    label: 'Community',
    image: 'https://res.cloudinary.com/dlqxg5hp0/image/upload/v1769224724/Gemini_Generated_Image_affqmuaffqmuaffq_azgvee.png',
    gradient: 'from-pink-500 to-rose-500',
    count: '10K+ Members',
    description: 'Share recipes & connect with foodies',
    iconComponent: <MessageCircle className="w-8 h-8 text-white" />
  },
];

// --- FETCH DATA FROM BACKEND ---
interface Recipe {
  id: string; // Map from _id
  title: string;
  mainImageUrl: string;
  cookTime: number;
  totalCost: number;
  // Mock fields for UI
  rating?: number;
}

import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onNavigate?: (page: string, recipeId?: string) => void; // Legacy
}

export function HomePage({ onNavigate }: HomePageProps) {
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Trusted Stats Data
  const trustedStats = [
    { icon: Star, label: '4.9/5 App Rating', value: '10,000+ Reviews', color: 'text-[#FFB800]' },
    { icon: Users, label: '500+ Active Chefs', value: 'Expert Community', color: 'text-[#FF6B35]' },
    { icon: Award, label: '10,000+ Recipes', value: 'Always Fresh', color: 'text-[#4CAF50]' },
    { icon: Truck, label: 'Free Shipping', value: 'Orders over $30', color: 'text-blue-500' },
  ];

  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/recipes/latest');
        const data = await res.json();

        // Map data to match UI needs
        const mappedRecipes = data.map((item: any) => ({
          id: item.id || item._id, // Handle both id and _id
          title: item.title,
          mainImageUrl: item.mainImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // Fallback image
          cookTime: item.cookTime,
          totalCost: item.totalCost,
          rating: 4.5 + Math.random() * 0.5 // Mock rating 4.5 - 5.0
        }));

        setTrendingRecipes(mappedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
        // Fallback to empty or keep loading
      }
    };
    fetchRecipes();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    switch (categoryId) {
      case 'restaurants': navigate('/restaurants'); break;
      case 'marketplace': navigate('/marketplace'); break;
      case 'community': navigate('/community'); break;
      default: navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header with Auth Check */}
      <Header onNavigate={onNavigate as any} />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Hero Slider */}
          <HeroSlider />

          {/* TRUSTED STATS STRIP - Glassmorphism */}
          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg animate-in fade-in duration-700">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {trustedStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-105 min-w-[100px]"
                >
                  <stat.icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${stat.color}`} />
                  <div className="font-bold text-lg md:text-xl text-gray-900">{stat.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* IMPROVED: Explore Categories */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
                <p className="text-gray-600">Discover delicious options curated just for you</p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group relative block w-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-[500px] md:!h-[600px]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-40 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {category.iconComponent}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-2xl group-hover:text-[#FFB800] transition-colors">
                        {category.label}
                      </h3>

                      <div className="text-sm font-semibold text-white/90">
                        {category.count}
                      </div>

                      <div className="text-sm text-white/80">
                        {category.description}
                      </div>

                      {/* Hover Indicator */}
                      <div className="pt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-semibold">Explore Now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Meal Planning Banner */}
          <button
            onClick={() => navigate('/meal-planner')}
            className="group relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mb-8 text-left block"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://res.cloudinary.com/dlqxg5hp0/image/upload/v1769225710/download_jxdwrh.jpg"
                alt="AI Meal Planning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#9C27B0] to-[#673AB7] opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-white">
              <div className="mb-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Powered</span>
              </div>

              <div className="space-y-3 max-w-2xl">
                <h2 className="font-bold text-3xl md:text-4xl group-hover:text-[#FFB800] transition-colors">
                  AI Meal Planning
                </h2>

                <p className="text-lg text-white/90">
                  Let AI create personalized meal plans based on your preferences and goals
                </p>

                <div className="pt-2 flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-base">Start Planning Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </button>

          {/* Trending Recipes */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Trending Recipes</h2>
              <button className="text-[#FF6B35] font-medium hover:underline">View All</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {trendingRecipes.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Chưa có công thức nào. Vui lòng kiểm tra kết nối backend!
                </div>
              )}
              {trendingRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onNavigate('recipe', recipe.id)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={recipe.mainImageUrl || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    <Badge className="absolute bottom-3 left-3 bg-[#4CAF50] text-white">
                      ${recipe.totalCost}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-left">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                        <span className="font-medium">{recipe.rating?.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.cookTime} mins</span>
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

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div >
  );
}