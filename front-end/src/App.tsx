import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthPage } from './components/AuthPage';
import { OnboardingPage } from './components/OnboardingPage';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { RecipeDetailPage } from './components/RecipeDetailPage';
import { ReelsPage } from './components/ReelsPage';
import { MealPlanningPage } from './components/MealPlanningPage';
import { ChatSupportPage } from './components/ChatSupportPage';
import { CartPage } from './components/CartPage';
import { CheckoutShippingPage } from './components/CheckoutShippingPage';
import { CheckoutPaymentPage } from './components/CheckoutPaymentPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { ProfilePage } from './components/ProfilePage';
import { TasteWalletPage } from './components/TasteWalletPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';
import { CreatorStudioPage } from './components/CreatorStudioPage';
import { NotFoundPage } from './components/NotFoundPage';
import { RestaurantListPage } from './components/RestaurantListPage';
import { RestaurantDetailPage } from './components/RestaurantDetailPage';
import { FoodOrderTrackingPage } from './components/FoodOrderTrackingPage';
import { CommunityPage } from './components/CommunityPage';
import { IngredientMarketplacePage } from './components/IngredientMarketplacePage';
import { MobileNavigation } from './components/MobileNavigation';
import { RecipeManager } from './components/RecipeManager';
import { FavoritesPage } from './components/FavoritesPage';
import { MyRecipesPage } from './components/MyRecipesPage';
import { EditRecipePage } from './components/EditRecipePage';
import { EditProfilePage } from './components/EditProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute'; // Import ProtectedRoute

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const API_URL = "http://localhost:8080/api/auth";

  // --- CHECK SESSION ---
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
        localStorage.setItem('user', JSON.stringify(res.data));
        // If on auth page and logged in, redirect to home
        if (location.pathname === '/auth' || location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      } catch (error) {
        console.log("Chưa đăng nhập, vào chế độ khách.");
        localStorage.removeItem('user');
        // Do not redirect here, let the Routes handle access
      } finally {
        setIsLoadingSession(false);
      }
    };

    checkLoginStatus();
  }, [navigate, location.pathname]); // Add dependencies

  // --- LEGACY NAVIGATION HANDLER (Compatibility Layer) ---
  const handleNavigate = (page: string, recipeId?: string, query?: string) => {
    if (recipeId) setSelectedRecipe(recipeId);
    if (query !== undefined) setCurrentSearchQuery(query);

    switch (page) {
      case 'home': navigate('/'); break;
      case 'auth': navigate('/auth'); break;
      case 'login': navigate('/login'); break;
      case 'signup': navigate('/signup'); break;
      case 'onboarding': navigate('/onboarding'); break;
      case 'search': navigate(`/search${query ? `?q=${query}` : ''}`); break;
      case 'recipe': navigate(`/recipe/${recipeId || ''}`); break;
      case 'reels': navigate('/reels'); break;
      case 'planner': navigate('/meal-planner'); break;
      case 'chat': navigate('/chat'); break;
      case 'community': navigate('/community'); break;
      case 'cart': navigate('/cart'); break;
      case 'marketplace': navigate('/marketplace'); break;
      case 'checkout-shipping': navigate('/checkout/shipping'); break;
      case 'checkout-payment': navigate('/checkout/payment'); break;
      case 'tracking': navigate('/tracking'); break;
      case 'restaurants': navigate('/restaurants'); break;
      case 'restaurant-detail': navigate(`/restaurant/${recipeId || ''}`); break; // Reusing recipeId param for restaurantId
      case 'food-tracking': navigate('/food-tracking'); break;
      case 'profile': navigate('/profile'); break;
      case 'wallet': navigate('/wallet'); break;
      case 'notifications': navigate('/notifications'); break;
      case 'settings': navigate('/settings'); break;
      case 'creator': navigate('/creator'); break;
      case 'recipe-manager': navigate('/recipe-manager'); break;
      case 'favorites': navigate('/favorites'); break;
      case 'my-recipes': navigate('/my-recipes'); break;
      case 'edit-recipe': navigate(`/edit-recipe/${recipeId || ''}`); break;
      case 'edit-profile': navigate('/edit-profile'); break;
      default: navigate('*'); // 404
    }
    window.scrollTo(0, 0);
  };

  const showMobileNav = !['/auth', '/login', '/signup', '/onboarding'].includes(location.pathname);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Determine currentPage for MobileNav (simplified mapping)
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/recipe/')) return 'recipe';
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/meal-planner')) return 'planner';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/tracking')) return 'tracking';
    if (path.startsWith('/wallet')) return 'wallet';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/creator')) return 'creator';
    return 'home'; // default
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/auth" element={<AuthPage onComplete={() => navigate('/')} onNavigate={handleNavigate} />} />
        <Route path="/login" element={<AuthPage initialView="login" onComplete={() => navigate('/')} onNavigate={handleNavigate} />} />
        <Route path="/signup" element={<AuthPage initialView="signup" onComplete={() => navigate('/')} onNavigate={handleNavigate} />} />
        <Route path="/onboarding" element={<OnboardingPage onComplete={() => navigate('/')} />} />

        <Route path="/search" element={<SearchPage onNavigate={handleNavigate} initialQuery={currentSearchQuery} />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage onNavigate={handleNavigate} recipeId={selectedRecipe} />} />
        <Route path="/reels" element={<ReelsPage onNavigate={handleNavigate} />} />
        <Route path="/restaurants" element={<RestaurantListPage onNavigate={handleNavigate} />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage onNavigate={handleNavigate} />} />
        <Route path="/community" element={<CommunityPage onNavigate={handleNavigate} />} />
        <Route path="/marketplace" element={<IngredientMarketplacePage onNavigate={handleNavigate} />} />
        <Route path="/chat" element={<ChatSupportPage onNavigate={handleNavigate} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/meal-planner" element={<MealPlanningPage />} />
          <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />
          <Route path="/checkout/shipping" element={<CheckoutShippingPage onNavigate={handleNavigate} />} />
          <Route path="/checkout/payment" element={<CheckoutPaymentPage onNavigate={handleNavigate} />} />
          <Route path="/tracking" element={<OrderTrackingPage onNavigate={handleNavigate} />} />
          <Route path="/food-tracking" element={<FoodOrderTrackingPage onNavigate={handleNavigate} />} />
          <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
          <Route path="/wallet" element={<TasteWalletPage onNavigate={handleNavigate} />} />
          <Route path="/notifications" element={<NotificationsPage onNavigate={handleNavigate} />} />
          <Route path="/settings" element={<SettingsPage onNavigate={handleNavigate} />} />
          <Route path="/creator" element={<CreatorStudioPage onNavigate={handleNavigate} />} />
          <Route path="/recipe-manager" element={<RecipeManager />} />
          <Route path="/favorites" element={<FavoritesPage onNavigate={handleNavigate} />} />
          <Route path="/my-recipes" element={<MyRecipesPage onNavigate={handleNavigate} />} />
          <Route path="/edit-recipe/:id" element={<EditRecipePage onNavigate={handleNavigate} recipeId={null} />} /> {/* recipeId handled by params in component */}
          <Route path="/create-recipe" element={<EditRecipePage onNavigate={handleNavigate} recipeId={null} />} />
          <Route path="/edit-profile" element={<EditProfilePage onNavigate={handleNavigate} />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
      </Routes>

      {showMobileNav && (
        <MobileNavigation currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      )}
    </div>
  );
}