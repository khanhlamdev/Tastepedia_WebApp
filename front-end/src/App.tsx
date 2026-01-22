import { useState } from 'react';
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
// 1. IMPORT TRANG ĐĂNG BÀI MỚI
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
    | 'recipe-manager' // 2. THÊM TYPE NÀY ĐỂ KHÔNG BỊ LỖI ĐỎ
    | 'restaurants'
    | 'restaurant-detail'
    | 'food-tracking'
    | 'community'
    | 'marketplace'
    | '404';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleNavigate = (page: string, recipeId?: string) => {
    setAppState(page as AppState);
    if (recipeId) {
      setSelectedRecipe(recipeId);
    }
    // Cuộn lên đầu trang mỗi khi chuyển trang
    window.scrollTo(0, 0);
  };

  const handleAuthComplete = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    setAppState('home');
  };

  // Show mobile navigation for main app pages (not auth/onboarding/reels/checkout)
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
    // Lưu ý: Tôi KHÔNG thêm 'recipe-manager' vào đây
    // vì khi đăng bài ta cần không gian rộng, không nên hiện menu dưới chân trang.
  ].includes(appState);

  return (
      <div className="min-h-screen bg-background">
        {/* Phase A: Entry & Onboarding */}
        {appState === 'auth' && <AuthPage onComplete={handleAuthComplete} onNavigate={handleNavigate} />}
        {appState === 'onboarding' && <OnboardingPage onComplete={handleOnboardingComplete} />}

        {/* Phase B: Discovery */}
        {appState === 'home' && <HomePage onNavigate={handleNavigate} />}
        {appState === 'search' && <SearchPage onNavigate={handleNavigate} />}
        {appState === 'reels' && <ReelsPage onNavigate={handleNavigate} />}
        {appState === 'recipe' && <RecipeDetailPage onNavigate={handleNavigate} />}

        {/* Phase C: Utility & AI */}
        {appState === 'planner' && <MealPlannerPage onNavigate={handleNavigate} />}
        {appState === 'chat' && <ChatSupportPage onNavigate={handleNavigate} />}
        {appState === 'community' && <CommunityPage onNavigate={handleNavigate} />}

        {/* Phase D: Commerce */}
        {appState === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {appState === 'marketplace' && <IngredientMarketplacePage onNavigate={handleNavigate} />}
        {appState === 'checkout-shipping' && <CheckoutShippingPage onNavigate={handleNavigate} />}
        {appState === 'checkout-payment' && <CheckoutPaymentPage onNavigate={handleNavigate} />}
        {appState === 'tracking' && <OrderTrackingPage onNavigate={handleNavigate} />}

        {/* Restaurant Service Module */}
        {appState === 'restaurants' && <RestaurantListPage onNavigate={handleNavigate} />}
        {appState === 'restaurant-detail' && <RestaurantDetailPage onNavigate={handleNavigate} />}
        {appState === 'food-tracking' && <FoodOrderTrackingPage onNavigate={handleNavigate} />}

        {/* Phase E: User Ecosystem */}
        {appState === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        {appState === 'wallet' && <TasteWalletPage onNavigate={handleNavigate} />}
        {appState === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
        {appState === 'settings' && <SettingsPage onNavigate={handleNavigate} />}

        {/* Phase F: Creator & System */}
        {appState === 'creator' && <CreatorStudioPage onNavigate={handleNavigate} />}

        {/* 3. RENDER TRANG RECIPE MANAGER TẠI ĐÂY */}
        {appState === 'recipe-manager' && <RecipeManager />}

        {appState === '404' && <NotFoundPage onNavigate={handleNavigate} />}

        {/* Mobile Navigation */}
        {showMobileNav && (
            <MobileNavigation currentPage={appState} onNavigate={handleNavigate} />
        )}
      </div>
  );
}