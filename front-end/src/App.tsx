import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthPage } from './components/AuthPage';
import { OnboardingPage } from './components/OnboardingPage';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { RecipeDetailPage } from './components/RecipeDetailPage';
import { ReelsPage } from './components/ReelsPage';
import { MealPlannerPage } from './components/MealPlannerPage';
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

type AppState =
    | 'auth'
    | 'onboarding'
    | 'home'
    | 'search'
    | 'recipe'
    | 'reels'
    | 'planner'
    | 'chat'
    | 'cart'
    | 'checkout-shipping'
    | 'checkout-payment'
    | 'tracking'
    | 'profile'
    | 'wallet'
    | 'notifications'
    | 'settings'
    | 'creator'
    | 'recipe-manager'
    | 'restaurants'
    | 'restaurant-detail'
    | 'food-tracking'
    | 'community'
    | 'marketplace'
    | '404';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  // State loading để màn hình không bị nháy
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const API_URL = "http://localhost:8080/api/auth";

  // --- USE EFFECT QUAN TRỌNG: CHECK SESSION ---
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // [QUAN TRỌNG] Thêm { withCredentials: true } để gửi Cookie JSESSIONID lên Server
        await axios.get(`${API_URL}/me`, { withCredentials: true });

        // Nếu Server bảo OK (200) -> Giữ ở trang Home
        setAppState('home');
      } catch (error) {
        // Nếu Server bảo Lỗi (401) hoặc ko có mạng -> Về trang Login
        console.log("Phiên đăng nhập hết hạn hoặc chưa đăng nhập.");
        setAppState('auth');
      } finally {
        // Tắt loading dù thành công hay thất bại
        setIsLoadingSession(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleNavigate = (page: string, recipeId?: string) => {
    setAppState(page as AppState);
    if (recipeId) {
      setSelectedRecipe(recipeId);
    }
    window.scrollTo(0, 0);
  };

  const handleAuthComplete = () => {
    setAppState('home');
  };

  const handleOnboardingComplete = () => {
    setAppState('home');
  };

  const showMobileNav = [
    'home',
    'recipe',
    'search',
    'planner',
    'profile',
    'cart',
    'tracking',
    'wallet',
    'notifications',
    'settings',
    'creator',
  ].includes(appState);

  // Màn hình chờ khi đang check session
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

  return (
      <div className="min-h-screen bg-background">
        {appState === 'auth' && <AuthPage onComplete={handleAuthComplete} onNavigate={handleNavigate} />}
        {appState === 'onboarding' && <OnboardingPage onComplete={handleOnboardingComplete} />}
        {appState === 'home' && <HomePage onNavigate={handleNavigate} />}
        {appState === 'search' && <SearchPage onNavigate={handleNavigate} />}
        {appState === 'reels' && <ReelsPage onNavigate={handleNavigate} />}
        {appState === 'recipe' && <RecipeDetailPage onNavigate={handleNavigate} />}
        {appState === 'planner' && <MealPlannerPage onNavigate={handleNavigate} />}
        {appState === 'chat' && <ChatSupportPage onNavigate={handleNavigate} />}
        {appState === 'community' && <CommunityPage onNavigate={handleNavigate} />}
        {appState === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {appState === 'marketplace' && <IngredientMarketplacePage onNavigate={handleNavigate} />}
        {appState === 'checkout-shipping' && <CheckoutShippingPage onNavigate={handleNavigate} />}
        {appState === 'checkout-payment' && <CheckoutPaymentPage onNavigate={handleNavigate} />}
        {appState === 'tracking' && <OrderTrackingPage onNavigate={handleNavigate} />}
        {appState === 'restaurants' && <RestaurantListPage onNavigate={handleNavigate} />}
        {appState === 'restaurant-detail' && <RestaurantDetailPage onNavigate={handleNavigate} />}
        {appState === 'food-tracking' && <FoodOrderTrackingPage onNavigate={handleNavigate} />}
        {appState === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        {appState === 'wallet' && <TasteWalletPage onNavigate={handleNavigate} />}
        {appState === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
        {appState === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
        {appState === 'creator' && <CreatorStudioPage onNavigate={handleNavigate} />}
        {appState === 'recipe-manager' && <RecipeManager />}
        {appState === '404' && <NotFoundPage onNavigate={handleNavigate} />}

        {showMobileNav && (
            <MobileNavigation currentPage={appState} onNavigate={handleNavigate} />
        )}
      </div>
  );
}