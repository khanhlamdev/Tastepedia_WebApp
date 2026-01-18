import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, ShoppingCart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Card } from './ui/card';

interface MealPlannerPageProps {
  onNavigate: (page: string) => void;
}

export function MealPlannerPage({ onNavigate }: MealPlannerPageProps) {
  const [calorieLimit, setCalorieLimit] = useState([2000]);
  const [weeklyBudget, setWeeklyBudget] = useState([100]);
  const [currentWeek, setCurrentWeek] = useState(0);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const mealPlan = {
    Monday: {
      breakfast: { name: 'Greek Yogurt Bowl', calories: 320, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Grilled Chicken Salad', calories: 450, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      dinner: { name: 'Bún Chả Hà Nội', calories: 650, image: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?w=400' },
    },
    Tuesday: {
      breakfast: { name: 'Avocado Toast', calories: 380, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Pasta Carbonara', calories: 720, image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400' },
      dinner: { name: 'Grilled Salmon', calories: 520, image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?w=400' },
    },
    Wednesday: {
      breakfast: { name: 'Oatmeal & Berries', calories: 290, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Buddha Bowl', calories: 480, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      dinner: { name: 'Pad Thai', calories: 580, image: 'https://images.unsplash.com/photo-1542666836-03522463be07?w=400' },
    },
    Thursday: {
      breakfast: { name: 'Smoothie Bowl', calories: 310, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Turkey Sandwich', calories: 420, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      dinner: { name: 'Grilled Ribeye', calories: 680, image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?w=400' },
    },
    Friday: {
      breakfast: { name: 'Eggs Benedict', calories: 450, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Sushi Bowl', calories: 520, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      dinner: { name: 'Pizza Margherita', calories: 620, image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400' },
    },
    Saturday: {
      breakfast: { name: 'Pancakes', calories: 480, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'BBQ Burger', calories: 740, image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?w=400' },
      dinner: { name: 'Seafood Paella', calories: 590, image: 'https://images.unsplash.com/photo-1542666836-03522463be07?w=400' },
    },
    Sunday: {
      breakfast: { name: 'French Toast', calories: 420, image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?w=400' },
      lunch: { name: 'Roast Chicken', calories: 650, image: 'https://images.unsplash.com/photo-1762305193367-91e072e47c3f?w=400' },
      dinner: { name: 'Chocolate Lava Cake', calories: 480, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400' },
    },
  };

  const calculateDailyCalories = (day: keyof typeof mealPlan) => {
    const meals = mealPlan[day];
    return meals.breakfast.calories + meals.lunch.calories + meals.dinner.calories;
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Meal Planner</h1>
            <Badge className="bg-[#4CAF50] text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white rounded-3xl shadow-lg sticky top-4">
              <h3 className="font-bold text-lg mb-6">Preferences</h3>

              {/* Calorie Limit */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Daily Calories</label>
                  <span className="text-[#FF6B35] font-bold">{calorieLimit[0]}</span>
                </div>
                <Slider
                  value={calorieLimit}
                  onValueChange={setCalorieLimit}
                  min={1200}
                  max={3000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1200</span>
                  <span>3000</span>
                </div>
              </div>

              {/* Weekly Budget */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Weekly Budget</label>
                  <span className="text-[#4CAF50] font-bold">${weeklyBudget[0]}</span>
                </div>
                <Slider
                  value={weeklyBudget}
                  onValueChange={setWeeklyBudget}
                  min={50}
                  max={300}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$50</span>
                  <span>$300</span>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Dietary Goals</label>
                <div className="space-y-2">
                  {['High Protein', 'Low Carb', 'Vegetarian', 'Balanced'].map((goal) => (
                    <button
                      key={goal}
                      className="w-full text-left px-4 py-2 rounded-xl bg-gray-50 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] transition-colors text-sm"
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button className="w-full h-11 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full mb-3">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Plan
              </Button>

              <Button variant="outline" className="w-full h-11 rounded-full">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add Week to Cart
              </Button>
            </Card>
          </div>

          {/* Right Content - Calendar Grid */}
          <div className="lg:col-span-3">
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#FF6B35]" />
                <h2 className="text-xl font-bold">Week of Jan 20 - Jan 26</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] text-white rounded-2xl">
                <div className="text-sm opacity-90 mb-1">Avg. Calories/Day</div>
                <div className="text-3xl font-bold">1,620</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-white rounded-2xl">
                <div className="text-sm opacity-90 mb-1">Weekly Cost</div>
                <div className="text-3xl font-bold">$87.50</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
                <div className="text-sm opacity-90 mb-1">Recipes</div>
                <div className="text-3xl font-bold">21</div>
              </Card>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(mealPlan).map(([day, meals], dayIndex) => {
                const totalCalories = calculateDailyCalories(day as keyof typeof mealPlan);
                const isToday = dayIndex === 0;

                return (
                  <Card key={day} className={`bg-white rounded-2xl overflow-hidden shadow-md ${isToday ? 'ring-2 ring-[#FF6B35]' : ''}`}>
                    <div className={`p-3 ${isToday ? 'bg-[#FF6B35]' : 'bg-gray-100'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                          {day}
                        </h3>
                        {isToday && (
                          <Badge className="bg-white text-[#FF6B35] text-xs">Today</Badge>
                        )}
                      </div>
                      <div className={`text-sm mt-1 ${isToday ? 'text-white/90' : 'text-gray-600'}`}>
                        {totalCalories} cal
                      </div>
                    </div>

                    <div className="p-3 space-y-3">
                      {/* Breakfast */}
                      <div className="group cursor-pointer">
                        <div className="text-xs text-gray-500 mb-1">Breakfast</div>
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-1">
                          <img
                            src={meals.breakfast.image}
                            alt={meals.breakfast.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-sm font-medium">{meals.breakfast.name}</div>
                        <div className="text-xs text-gray-500">{meals.breakfast.calories} cal</div>
                      </div>

                      {/* Lunch */}
                      <div className="group cursor-pointer">
                        <div className="text-xs text-gray-500 mb-1">Lunch</div>
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-1">
                          <img
                            src={meals.lunch.image}
                            alt={meals.lunch.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-sm font-medium">{meals.lunch.name}</div>
                        <div className="text-xs text-gray-500">{meals.lunch.calories} cal</div>
                      </div>

                      {/* Dinner */}
                      <div className="group cursor-pointer">
                        <div className="text-xs text-gray-500 mb-1">Dinner</div>
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-1">
                          <img
                            src={meals.dinner.image}
                            alt={meals.dinner.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-sm font-medium">{meals.dinner.name}</div>
                        <div className="text-xs text-gray-500">{meals.dinner.calories} cal</div>
                      </div>

                      {/* Add Custom Meal Button */}
                      <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-colors flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#FF6B35]">
                        <Plus className="w-4 h-4" />
                        Add Snack
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
