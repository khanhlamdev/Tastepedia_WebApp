import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star, Clock, Heart, Flame } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface SearchPageProps {
  onNavigate: (page: string, recipeId?: string) => void;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('Chicken');
  const [calorieRange, setCalorieRange] = useState([500]);
  const [timeRange, setTimeRange] = useState([30]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(['low', 'medium']);

  const searchResults = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMGRpc2h8ZW58MXx8fHwxNzY4NTI4ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Grilled Chicken Breast',
      rating: 4.7,
      time: 25,
      calories: 320,
      price: '$8.50',
      cuisine: 'American'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Chicken Caesar Salad',
      rating: 4.8,
      time: 15,
      calories: 420,
      price: '$12.00',
      cuisine: 'Italian'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1542666836-03522463be07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXMlMjBjb29raW5nfGVufDF8fHx8MTc2ODU3NzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Thai Chicken Noodles',
      rating: 4.9,
      time: 30,
      calories: 480,
      price: '$9.00',
      cuisine: 'Thai'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3Njg0ODY3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Chicken Alfredo Pasta',
      rating: 4.6,
      time: 35,
      calories: 620,
      price: '$14.00',
      cuisine: 'Italian'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMGRpc2h8ZW58MXx8fHwxNzY4NTI4ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'BBQ Chicken Wings',
      rating: 4.5,
      time: 40,
      calories: 550,
      price: '$11.00',
      cuisine: 'American'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Chicken Buddha Bowl',
      rating: 4.9,
      time: 20,
      calories: 380,
      price: '$10.50',
      cuisine: 'Asian Fusion'
    },
  ];

  const cuisines = ['Italian', 'Thai', 'American', 'Mexican', 'Asian Fusion', 'Indian'];
  const popularSearches = ['Pasta', 'Salad', 'Steak', 'Soup', 'Dessert'];

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const FiltersSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Calories</h3>
        <div className="mb-2">
          <span className="text-sm text-gray-600">Max: {calorieRange[0]} kcal</span>
        </div>
        <Slider
          value={calorieRange}
          onValueChange={setCalorieRange}
          min={100}
          max={1000}
          step={50}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>100</span>
          <span>1000</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Cooking Time</h3>
        <div className="mb-2">
          <span className="text-sm text-gray-600">Max: {timeRange[0]} mins</span>
        </div>
        <Slider
          value={timeRange}
          onValueChange={setTimeRange}
          min={5}
          max={120}
          step={5}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5m</span>
          <span>120m</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          {[
            { id: 'low', label: 'Budget ($0-$10)', value: 'low' },
            { id: 'medium', label: 'Medium ($10-$20)', value: 'medium' },
            { id: 'high', label: 'Premium ($20+)', value: 'high' },
          ].map(option => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={option.id}
                checked={priceRange.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPriceRange([...priceRange, option.value]);
                  } else {
                    setPriceRange(priceRange.filter(p => p !== option.value));
                  }
                }}
              />
              <label htmlFor={option.id} className="text-sm cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(cuisine => (
            <Badge
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`cursor-pointer transition-all ${
                selectedCuisines.includes(cuisine)
                  ? 'bg-[#FF6B35] text-white hover:bg-[#ff5722]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cuisine}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setCalorieRange([500]);
          setTimeRange([30]);
          setSelectedCuisines([]);
          setPriceRange(['low', 'medium']);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients..."
                className="pl-10 pr-10 h-11 rounded-full bg-[#F9F9F9] border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden rounded-full">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto">
                  <FiltersSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              </div>
              <FiltersSidebar />
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {/* Results Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600">
                {searchResults.length} recipes found
              </p>
            </div>

            {/* Active Filters */}
            {(selectedCuisines.length > 0 || calorieRange[0] < 500 || timeRange[0] < 30) && (
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCuisines.map(cuisine => (
                  <Badge
                    key={cuisine}
                    className="bg-[#FF6B35] text-white"
                  >
                    {cuisine}
                    <button
                      onClick={() => toggleCuisine(cuisine)}
                      className="ml-2 hover:bg-white/20 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {calorieRange[0] < 500 && (
                  <Badge className="bg-[#4CAF50] text-white">
                    Under {calorieRange[0]} cal
                  </Badge>
                )}
                {timeRange[0] < 30 && (
                  <Badge className="bg-blue-500 text-white">
                    Under {timeRange[0]} mins
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((recipe) => (
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
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-[#4CAF50] text-white">
                          {recipe.calories} cal
                        </Badge>
                      </div>
                      <Badge className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900">
                        {recipe.price}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-left line-clamp-1">
                        {recipe.title}
                      </h3>
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
                      <div className="mt-2 text-xs text-gray-500">{recipe.cuisine}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No recipes found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search for something else
                </p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Popular Searches:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.map(search => (
                      <Badge
                        key={search}
                        onClick={() => setSearchQuery(search)}
                        className="cursor-pointer bg-[#FF6B35] text-white hover:bg-[#ff5722]"
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
