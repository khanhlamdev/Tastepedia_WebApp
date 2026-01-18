/**
 * Tastepedia - Layout Components Usage Examples
 * 
 * This file demonstrates how to use the Header, Footer, and MainLayout
 * components in various scenarios.
 */

import { MainLayout } from './components/layout/MainLayout';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// ============================================================================
// EXAMPLE 1: Basic Page with MainLayout
// ============================================================================

function HomePage() {
  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
    // Your routing logic here (React Router, Next.js router, etc.)
  };

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={5}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Tastepedia</h1>
        <p className="text-gray-600">
          Your ultimate culinary companion with recipes, ingredients, and community.
        </p>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 2: Page Without Footer (Checkout/Payment)
// ============================================================================

function CheckoutPage() {
  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
  };

  return (
    <MainLayout 
      onNavigate={handleNavigate} 
      cartCount={3}
      showFooter={false}  // Hide footer on checkout page
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {/* Checkout form here */}
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 3: Full-Screen Experience (No Header/Footer)
// ============================================================================

function VideoPlayerPage() {
  return (
    <MainLayout 
      showHeader={false}
      showFooter={false}
    >
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        {/* Full-screen video player */}
        <div className="text-white">Video Player</div>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 4: Custom Layout with Standalone Header
// ============================================================================

function CustomLayoutPage() {
  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Use only the Header component */}
      <Header onNavigate={handleNavigate} cartCount={2} />
      
      {/* Your custom content */}
      <div className="py-16 text-white text-center">
        <h1 className="text-5xl font-bold">Custom Dark Layout</h1>
        <p className="mt-4">Using standalone Header component</p>
      </div>
      
      {/* No footer on this page */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Landing Page with Custom Footer Only
// ============================================================================

function LandingPage() {
  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
  };

  return (
    <div className="min-h-screen">
      {/* Custom hero section without standard header */}
      <div className="h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Welcome</h1>
      </div>
      
      {/* Your content sections */}
      <div className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Features</h2>
        {/* Feature cards */}
      </div>
      
      {/* Use only the Footer component */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Recipe Detail Page with Dynamic Cart Count
// ============================================================================

function RecipeDetailPage() {
  const [cartCount, setCartCount] = React.useState(3);

  const handleNavigate = (page: string) => {
    if (page === 'cart') {
      console.log('Opening cart with', cartCount, 'items');
    }
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={cartCount}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Bún Chả Hà Nội</h1>
        <p className="text-gray-600 mb-6">Delicious Vietnamese dish</p>
        
        <button
          onClick={addToCart}
          className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
        >
          Add Ingredients to Cart
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          Current cart items: {cartCount}
        </p>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 7: Multi-Step Form (Show/Hide Layout Elements)
// ============================================================================

function MultiStepFormPage() {
  const [step, setStep] = React.useState(1);
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  return (
    <MainLayout
      onNavigate={handleNavigate}
      cartCount={0}
      showHeader={step === 1}  // Only show header on first step
      showFooter={step === 1}  // Only show footer on first step
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Info</h2>
            <button
              onClick={() => setStep(2)}
              className="bg-orange-500 text-white px-6 py-3 rounded"
            >
              Next Step
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Step 2: Full Screen Form</h2>
              <p className="text-gray-600 mb-4">Header and footer hidden</p>
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-6 py-3 rounded"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 8: Integrating with React Router
// ============================================================================

import { useNavigate, useLocation } from 'react-router-dom';

function AppWithRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart count from context, Redux, or local state
  const cartCount = 5; // Example

  const handleNavigate = (page: string) => {
    // Map page names to routes
    const routes: Record<string, string> = {
      home: '/',
      search: '/recipes',
      recipe: '/recipe/1',
      community: '/community',
      about: '/about',
      cart: '/cart',
      auth: '/login',
      terms: '/terms',
      privacy: '/privacy',
      // ... more routes
    };

    const route = routes[page] || `/${page}`;
    navigate(route);
  };

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={cartCount}>
      {/* Your route content here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Current route: {location.pathname}</p>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 9: With Context/State Management
// ============================================================================

import { createContext, useContext, useState, ReactNode } from 'react';

// Create a Cart Context
const CartContext = createContext({
  count: 0,
  addItem: () => {},
  removeItem: () => {},
});

function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const addItem = () => setCount(prev => prev + 1);
  const removeItem = () => setCount(prev => Math.max(0, prev - 1));

  return (
    <CartContext.Provider value={{ count, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

function AppWithContext() {
  const { count } = useContext(CartContext);
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={count}>
      <ProductsPage />
    </MainLayout>
  );
}

function ProductsPage() {
  const { addItem } = useContext(CartContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <button
        onClick={addItem}
        className="bg-orange-500 text-white px-6 py-3 rounded"
      >
        Add Product to Cart
      </button>
    </div>
  );
}

// Root component
function AppRoot() {
  return (
    <CartProvider>
      <AppWithContext />
    </CartProvider>
  );
}

// ============================================================================
// EXAMPLE 10: SEO-Friendly Page with Metadata
// ============================================================================

import { Helmet } from 'react-helmet-async';

function SEOPage() {
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  return (
    <>
      <Helmet>
        <title>Tastepedia - Your Culinary Companion</title>
        <meta name="description" content="Discover recipes, order ingredients, join community" />
        <meta property="og:title" content="Tastepedia" />
        <meta property="og:description" content="Your ultimate culinary companion" />
      </Helmet>

      <MainLayout onNavigate={handleNavigate} cartCount={3}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1>SEO-Optimized Page</h1>
        </div>
      </MainLayout>
    </>
  );
}

// ============================================================================
// EXAMPLE 11: Conditional Rendering Based on Auth Status
// ============================================================================

function AuthAwarePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Guest');

  const handleNavigate = (page: string) => {
    if (page === 'auth') {
      // Show login modal or navigate to login page
      setIsAuthenticated(true);
      setUserName('John Doe');
    }
  };

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={isAuthenticated ? 5 : 0}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAuthenticated ? (
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
            <p className="mt-4">You have 5 items in your cart.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">Welcome to Tastepedia</h1>
            <p className="mt-4">Please log in to start shopping.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 12: Loading State
// ============================================================================

function LoadingStatePage() {
  const [isLoading, setIsLoading] = useState(true);
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  React.useEffect(() => {
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <MainLayout onNavigate={handleNavigate} cartCount={3}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">Content Loaded!</h1>
            <p className="mt-4">Your content here...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXAMPLE 13: Error Boundary with Layout
// ============================================================================

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">Something went wrong</p>
        <p className="text-sm text-gray-500">{error.message}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

function AppWithErrorBoundary() {
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MainLayout onNavigate={handleNavigate} cartCount={3}>
        {/* Your content */}
      </MainLayout>
    </ErrorBoundary>
  );
}

// ============================================================================
// EXAMPLE 14: Print-Friendly Page (Hide Header/Footer for Print)
// ============================================================================

function PrintFriendlyPage() {
  const [isPrinting, setIsPrinting] = useState(false);
  const handleNavigate = (page: string) => console.log('Navigate:', page);

  React.useEffect(() => {
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  return (
    <MainLayout
      onNavigate={handleNavigate}
      cartCount={3}
      showHeader={!isPrinting}  // Hide when printing
      showFooter={!isPrinting}  // Hide when printing
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Recipe: Bún Chả</h1>
        <p className="mb-4">Ingredients and instructions...</p>
        <button
          onClick={() => window.print()}
          className="bg-orange-500 text-white px-6 py-3 rounded print:hidden"
        >
          Print Recipe
        </button>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export {
  HomePage,
  CheckoutPage,
  VideoPlayerPage,
  CustomLayoutPage,
  LandingPage,
  RecipeDetailPage,
  MultiStepFormPage,
  AppWithRouter,
  AppRoot,
  SEOPage,
  AuthAwarePage,
  LoadingStatePage,
  AppWithErrorBoundary,
  PrintFriendlyPage,
};

// ============================================================================
// QUICK REFERENCE
// ============================================================================

/*

BASIC USAGE:
-----------
import { MainLayout } from './components/layout/MainLayout';

<MainLayout onNavigate={handleNavigate} cartCount={5}>
  <YourContent />
</MainLayout>


PROPS:
------
- children: ReactNode (required)
- onNavigate?: (page: string) => void
- cartCount?: number (default: 3)
- showHeader?: boolean (default: true)
- showFooter?: boolean (default: true)


STANDALONE COMPONENTS:
---------------------
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

<Header onNavigate={handleNavigate} cartCount={5} />
<Footer onNavigate={handleNavigate} />


NAVIGATION HANDLER:
------------------
const handleNavigate = (page: string) => {
  // page values: 'home', 'search', 'recipe', 'community', 
  //              'about', 'cart', 'auth', 'terms', 'privacy', etc.
  
  // Your routing logic (React Router, Next.js, custom)
  router.push(`/${page}`);
};


CART COUNT:
----------
- Pass dynamic cart count from state/context
- Updates header badge automatically
- Shows "9+" if count > 9


COMMON PAGES:
------------
- Standard page: showHeader={true}, showFooter={true}
- Checkout: showFooter={false}
- Full-screen: showHeader={false}, showFooter={false}
- Landing: Custom header, showFooter={true}

*/
