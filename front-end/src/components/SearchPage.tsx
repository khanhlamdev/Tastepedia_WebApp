import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Star, Clock, Heart, Flame, Leaf, Video } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface SearchPageProps {
  onNavigate: (page: string, recipeId?: string) => void;
  initialQuery?: string;
}

export function SearchPage({ onNavigate, initialQuery = '' }: SearchPageProps) {
  // Query & Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery); // Default to initialQuery

  // Defaults set to High values so we don't filter out everything by default
  const [calorieMax, setCalorieMax] = useState([2000]);
  const [timeMax, setTimeMax] = useState([180]);
  const [carbMax, setCarbMax] = useState([200]);   // Max Carbs (g)
  const [fatMax, setFatMax] = useState([100]);     // Max Fat (g)
  const [proteinMax, setProteinMax] = useState([200]); // Max Protein (g)

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);

  // Data State
  interface Recipe {
    id: string;
    title: string;
    mainImageUrl: string;
    description: string;
    cookTime: number;
    totalCost: number;
    cuisine: string;
    dietaryType?: string[];
    nutrition?: { calories: number };
    videoUrl?: string; // NEW
    rating?: number; // Mock if not in DB
  }
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Constants
  const cuisines = ['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Âu Mỹ', 'Ý', 'Thái Lan'];
  const dietaryOptions = ['Healthy', 'Chay', 'Keto', 'Không Gluten'];
  const popularSearches = ['Phở', 'Bánh mì', 'Salad', 'Healthy', 'Gà rán'];

  // Calculate Price Range for API
  const getPriceParams = () => {
    let min: number | undefined = undefined;
    let max: number | undefined = undefined;

    const isLow = priceRanges.includes('low');
    const isMed = priceRanges.includes('medium');
    const isHigh = priceRanges.includes('high');

    if (!isLow && !isMed && !isHigh) return { min, max };

    // Find absolute min
    if (isLow) min = 0;
    else if (isMed) min = 10;
    else if (isHigh) min = 30;

    // Find absolute max
    if (isHigh) max = undefined; // No upper limit
    else if (isMed) max = 30;
    else if (isLow) max = 10;

    return { min, max };
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchQuery) params.append('keyword', searchQuery);

        selectedCuisines.forEach(c => params.append('cuisines', c));
        selectedDietary.forEach(d => params.append('dietaryTypes', d));

        // Only send if filtered down from max defaults
        if (timeMax[0] < 180) params.append('cookTimeMax', timeMax[0].toString());
        if (calorieMax[0] < 2000) params.append('caloriesMax', calorieMax[0].toString());
        if (carbMax[0] < 200) params.append('carbMax', carbMax[0].toString());
        if (fatMax[0] < 100) params.append('fatMax', fatMax[0].toString());
        if (proteinMax[0] < 200) params.append('proteinMax', proteinMax[0].toString());

        const { min, max } = getPriceParams();
        if (min !== undefined) params.append('minPrice', min.toString());
        if (max !== undefined) params.append('maxPrice', max.toString());

        const res = await fetch(`http://localhost:8080/api/recipes/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Map response
          const mapped = data.map((item: any) => ({
            id: item.id || item._id,
            title: item.title,
            mainImageUrl: item.mainImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            cookTime: item.cookTime,
            totalCost: item.totalCost,
            cuisine: item.cuisine,
            dietaryType: item.dietaryType,
            nutrition: item.nutrition,
            videoUrl: item.videoUrl,
            rating: 4.5
          }));
          setSearchResults(mapped);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCuisines, selectedDietary, timeMax, calorieMax, carbMax, fatMax, proteinMax, priceRanges]);

  // Sync initialQuery if it changes (e.g. from Header search)
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Calories */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" /> Max Calories
        </h3>
        <div className="mb-2 text-sm text-gray-600">
          {calorieMax[0] === 2000 ? "Any" : `< ${calorieMax[0]} kcal`}
        </div>
        <Slider
          value={calorieMax}
          onValueChange={setCalorieMax}
          min={100}
          max={2000}
          step={50}
        />
      </div>

      {/* Carbs */}
      <div>
        <h3 className="font-semibold mb-3">Max Carbs</h3>
        <div className="mb-2 text-sm text-gray-600">
          {carbMax[0] === 200 ? "Any" : `< ${carbMax[0]}g`}
        </div>
        <Slider
          value={carbMax}
          onValueChange={setCarbMax}
          min={0}
          max={200}
          step={5}
        />
      </div>

      {/* Protein */}
      <div>
        <h3 className="font-semibold mb-3">Max Protein</h3>
        <div className="mb-2 text-sm text-gray-600">
          {proteinMax[0] === 200 ? "Any" : `< ${proteinMax[0]}g`}
        </div>
        <Slider
          value={proteinMax}
          onValueChange={setProteinMax}
          min={0}
          max={200}
          step={5}
        />
      </div>

      {/* Fat */}
      <div>
        <h3 className="font-semibold mb-3">Max Fat</h3>
        <div className="mb-2 text-sm text-gray-600">
          {fatMax[0] === 100 ? "Any" : `< ${fatMax[0]}g`}
        </div>
        <Slider
          value={fatMax}
          onValueChange={setFatMax}
          min={0}
          max={100}
          step={5}
        />
      </div>

      {/* Time */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" /> Max Cook Time
        </h3>
        <div className="mb-2 text-sm text-gray-600">
          {timeMax[0] === 180 ? "Any" : `< ${timeMax[0]} mins`}
        </div>
        <Slider
          value={timeMax}
          onValueChange={setTimeMax}
          min={5}
          max={180}
          step={5}
        />
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-3">Est. Price</h3>
        <div className="space-y-2">
          {[
            { id: 'low', label: 'Budget ($)', value: 'low' },
            { id: 'medium', label: 'Standard ($$)', value: 'medium' },
            { id: 'high', label: 'Premium ($$$)', value: 'high' },
          ].map(option => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={option.id}
                checked={priceRanges.includes(option.value)}
                onCheckedChange={() => toggleSelection(option.value, priceRanges, setPriceRanges)}
              />
              <label htmlFor={option.id} className="text-sm cursor-pointer select-none">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <h3 className="font-semibold mb-3">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(c => (
            <Badge
              key={c}
              onClick={() => toggleSelection(c, selectedCuisines, setSelectedCuisines)}
              className={`cursor-pointer transition-all ${selectedCuisines.includes(c)
                ? 'bg-[#FF6B35] text-white hover:bg-[#ff5722]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-500" /> Dietary
        </h3>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(d => (
            <Badge
              key={d}
              onClick={() => toggleSelection(d, selectedDietary, setSelectedDietary)}
              className={`cursor-pointer transition-all ${selectedDietary.includes(d)
                ? 'bg-[#FF6B35] text-white hover:bg-[#ff5722]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={() => {
          setCalorieMax([2000]);
          setTimeMax([180]);
          setCarbMax([200]);
          setFatMax([100]);
          setProteinMax([200]);
          setSelectedCuisines([]);
          setSelectedDietary([]);
          setPriceRanges([]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-32 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipe name..."
                className="pl-10 pr-10 h-11 rounded-full bg-[#F9F9F9] border-0 focus-visible:ring-1 focus-visible:ring-[#FF6B35]"
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

            {/* Mobile Filter Sheet - SỬA LẠI PHẦN NÀY */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden rounded-full">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0 bg-white rounded-t-2xl">
                <div className="flex flex-col" style={{ maxHeight: '50vh', height: '50vh' }}>
                  {/* Header */}
                  <div className="px-6 py-4 border-b shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Filters</h2>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content - ĐẢM BẢO CÓ OVERFLOW */}
                  <div
                    className="flex-1 overflow-y-auto px-6 py-4"
                    style={{
                      maxHeight: 'calc(50vh - 120px)', // Trừ đi chiều cao header và nút
                      minHeight: '200px' // Đảm bảo có chiều cao tối thiểu
                    }}
                  >
                    {/* Search Input inside Filter Sheet */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-2 block">Search Recipe</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. Bánh mì..."
                          className="pl-9 bg-gray-50"
                        />
                      </div>
                    </div>

                    <FiltersContent />
                  </div>

                  {/* Fixed Search Button at Bottom */}
                  <div className="px-6 py-4 border-t bg-white shrink-0">
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full h-12 text-base font-semibold bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full shadow-lg"
                    >
                      Search ({searchResults.length} results)
                    </Button>
                  </div>
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
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              </div>
              <FiltersContent />
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {/* Results Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : "Explore Recipes"}
              </h1>
              <p className="text-gray-600">
                {searchResults.length} result{searchResults.length !== 1 && 's'} found
              </p>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B35]"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => onNavigate('recipe', recipe.id)}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={recipe.mainImageUrl || "/placeholder.svg"}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495521821378-cf606dbcd9dd?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {recipe.videoUrl && (
                          <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video hướng dẫn
                          </Badge>
                        )}
                        {recipe.dietaryType?.map(dt => (
                          <Badge key={dt} className="mr-1 bg-green-500/90 backdrop-blur-sm text-white border-0">
                            {dt}
                          </Badge>
                        ))}
                      </div>
                      <Badge className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 shadow-sm">
                        ${recipe.totalCost}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1 flex-1 mr-2">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm bg-orange-50 px-2 py-1 rounded-full text-orange-600">
                          <Star className="w-3 h-3 fill-orange-600" />
                          <span className="font-bold">{recipe.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.cookTime}m</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4" />
                          <span>{recipe.nutrition?.calories || 0} kcal</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {recipe.cuisine}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🍳</div>
                <h3 className="text-xl font-bold mb-2">No recipes matches your filters</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or resetting filters to see more results.
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
                        className="cursor-pointer bg-orange-100 text-orange-700 hover:bg-orange-200 border-0"
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