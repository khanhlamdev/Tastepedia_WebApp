import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Burnt toast emoji/illustration */}
            <div className="relative z-10">
              <div className="text-8xl mb-2">🍞</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/40 rounded-lg"></div>
              </div>
            </div>
            
            {/* Smoke effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-16 h-24 bg-gradient-to-t from-gray-400/30 to-transparent rounded-full blur-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-bold mb-2">Oops! We overcooked this page.</h2>
          <p className="text-muted-foreground">
            The page you're looking for seems to have burned in the oven. 
            Don't worry, there's plenty more deliciousness to explore!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('home')}
            className="w-full h-12 bg-primary hover:bg-primary/90 rounded-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Kitchen (Home)
          </Button>

          <Button
            onClick={() => onNavigate('search')}
            variant="outline"
            className="w-full h-12 rounded-full"
          >
            <Search className="w-5 h-5 mr-2" />
            Search for Recipes
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl">
          <p className="text-sm font-semibold mb-3">Popular Destinations:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onNavigate('search')}
            >
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onNavigate('reels')}
            >
              Reels
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onNavigate('planner')}
            >
              Meal Planner
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onNavigate('profile')}
            >
              Profile
            </Button>
          </div>
        </div>

        {/* Error ID */}
        <p className="text-xs text-muted-foreground mt-6">
          Error ID: TP-404-{Date.now().toString().slice(-6)}
        </p>
      </div>
    </div>
  );
}
