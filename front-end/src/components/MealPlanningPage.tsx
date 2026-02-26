import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Sparkles, Check, AlertCircle, Clock, Activity, Utensils,Leaf, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress'; // Nếu bạn chưa có component này, tôi sẽ thay bằng div thủ công bên dưới

// --- INTERFACES ---
interface Meal {
    type: string;
    recipeName: string;
    calories: number;
    image?: string;
    recipeId?: string;
    reason?: string;
}

interface DayPlan {
    day: string;
    meals: Meal[];
}

interface MealPlanResponse {
    analysis: string;
    days: DayPlan[];
    error?: string;
}

export function MealPlanningPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loadingProgress, setLoadingProgress] = useState(0); // Để làm thanh loading
    const [loadingText, setLoadingText] = useState('Analyzing your profile...');
    const [result, setResult] = useState<MealPlanResponse | null>(null);

    // --- FORM STATE ---
    const [goal, setGoal] = useState('Healthy Living');
    const [activity] = useState('Moderately Active');
    const [diet, setDiet] = useState('None');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [budget] = useState('Date Night');
    const [time] = useState('30-60 mins');
    const [kitchenTools, setKitchenTools] = useState<string[]>(['Stove', 'Oven', 'Microwave', 'Rice Cooker', 'Air Fryer', 'Blender']);
    const [cuisine, setCuisine] = useState('All');
    const [schedule, setSchedule] = useState<string[]>(['Breakfast', 'Lunch', 'Dinner']);

    // --- LOGIC TOGGLE ---
    const toggleTool = (tool: string) => {
        setKitchenTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
    };

    const toggleSchedule = (meal: string) => {
        setSchedule(prev => prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]);
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies(prev => prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]);
    };

    // --- LOAD USER PREFS ---
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const prefs = user.preferences;
                if (prefs) {
                    const goalMap: Record<string, string> = {
                        'healthy': 'Healthy Living', 'muscle': 'Muscle Gain',
                        'save': 'Maintenance', 'quick': 'Maintenance',
                        'learn': 'Healthy Living', 'explore': 'Healthy Living'
                    };
                    if (prefs.goal && goalMap[prefs.goal]) setGoal(goalMap[prefs.goal]);

                    const dietMap: Record<string, string> = {
                        'omnivore': 'None', 'vegetarian': 'Vegetarian',
                        'vegan': 'Vegan', 'keto': 'Keto', 'paleo': 'Paleo', 'pescatarian': 'None'
                    };
                    if (prefs.diet && dietMap[prefs.diet]) setDiet(dietMap[prefs.diet]);

                    if (prefs.allergies && Array.isArray(prefs.allergies)) {
                        setAllergies(prefs.allergies);
                    }
                    if (prefs.cuisines && prefs.cuisines.length > 0) {
                        const c = prefs.cuisines[0];
                        if (c === 'vn') setCuisine('Vietnamese');
                        else if (['jp', 'kr', 'cn', 'in', 'th'].includes(c)) setCuisine('Asian');
                        else if (['it', 'fr', 'us', 'mx'].includes(c)) setCuisine('Western');
                    }
                }
            } catch (e) {
                console.error("Error loading preferences", e);
            }
        }
    }, []);

    // --- HANDLE GENERATE ---
    const handleGenerate = async () => {
        setStep(2);
        setLoadingProgress(10);

        // Giả lập loading progress mượt mà
        const messages = [
            "Analyzing your body type...",
            "Checking your kitchen tools...",
            "Scouring recipe database...",
            "Balancing macros & calories...",
            "Finalizing the perfect menu..."
        ];

        let i = 0;
        const textInterval = setInterval(() => {
            setLoadingText(messages[i % messages.length]);
            i++;
        }, 1500);

        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => Math.min(prev + 5, 90));
        }, 300);

        try {
            const res = await fetch('http://localhost:8080/api/ai/meal-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal, activityLevel: activity, dietaryPreference: diet,
                    allergies, dislikedIngredients: "", budget, cookingTime: time,
                    kitchenTools, preferredCuisine: cuisine, mealSchedule: schedule,
                    mealsPerDay: schedule.length
                })
            });
            const data = await res.json();

            setLoadingProgress(100);
            setTimeout(() => {
                setResult(data);
                clearInterval(textInterval);
                clearInterval(progressInterval);
                setStep(3);
            }, 500); // Delay chút để thấy 100%

        } catch (err) {
            console.error(err);
            alert("Failed to generate plan. Please try again.");
            setStep(1);
            clearInterval(textInterval);
            clearInterval(progressInterval);
        }
    };

    // --- COMPONENTS ---
    const SectionHeader = ({ icon: Icon, title, subTitle }: any) => (
        <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg text-[#FF6B35]">
                    <Icon className="w-5 h-5" />
                </div>
                {title}
            </h3>
            {subTitle && <p className="text-sm text-gray-500 ml-9">{subTitle}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#FF6B35 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Header */}
            <div className="relative z-10 bg-white border-b border-gray-100 sticky top-0 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                AI Chef Planner <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                            </h1>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                        Powered by Gemini 2.5 Flash
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto mt-8 px-4">

                {/* STEP 1: INPUT FORM */}
                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-5 duration-500">
                        {/* LEFT COLUMN - MAIN INPUTS */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <SectionHeader icon={Activity} title="1. Your Goal" subTitle="What do you want to achieve?" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {['Weight Loss', 'Muscle Gain', 'Healthy Living', 'Maintenance'].map(g => (
                                        <div
                                            key={g}
                                            onClick={() => setGoal(g)}
                                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${goal === g ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                                        >
                                            <span className={`font-medium ${goal === g ? 'text-[#FF6B35]' : 'text-gray-700'}`}>{g}</span>
                                            {goal === g && <Check className="w-5 h-5 text-[#FF6B35]" />}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <SectionHeader icon={Utensils} title="2. Diet & Allergies" subTitle="Any dietary restrictions?" />
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {['None', 'Vegan', 'Vegetarian', 'Keto', 'Paleo'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDiet(d)}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${diet === d ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-gray-50">
                                        <Label className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">Allergies to Avoid</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Eggs', 'Soy'].map(a => (
                                                <Badge
                                                    key={a}
                                                    variant="outline"
                                                    className={`cursor-pointer px-3 py-1.5 text-sm ${allergies.includes(a) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'}`}
                                                    onClick={() => toggleAllergy(a)}
                                                >
                                                    {a}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <SectionHeader icon={ChefHat} title="3. Kitchen Availability" subTitle="Select tools you have at home" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['Stove', 'Oven', 'Microwave', 'Rice Cooker', 'Air Fryer', 'Blender'].map(tool => (
                                        <div
                                            key={tool}
                                            onClick={() => toggleTool(tool)}
                                            className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kitchenTools.includes(tool) ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-100'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${kitchenTools.includes(tool) ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-gray-300 bg-white'}`}>
                                                {kitchenTools.includes(tool) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`font-medium text-sm ${kitchenTools.includes(tool) ? 'text-gray-900' : 'text-gray-500'}`}>{tool}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN - PREFERENCES */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="p-6 border-gray-100 shadow-sm h-full flex flex-col justify-between">
                                <div className="space-y-8">
                                    <SectionHeader icon={Search} title="4. Cuisine" />
                                    <div className="space-y-2">
                                        {['All', 'Vietnamese', 'Asian', 'Western'].map(c => (
                                            <div key={c} onClick={() => setCuisine(c)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${cuisine === c ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                <span className="font-medium text-sm text-gray-700">{c === 'All' ? 'Surprise Me (Mix)' : c}</span>
                                                {cuisine === c && <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <SectionHeader icon={Clock} title="5. Schedule" />
                                        <div className="space-y-2">
                                            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(m => (
                                                <div key={m} onClick={() => toggleSchedule(m)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${schedule.includes(m) ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${schedule.includes(m) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                                        {schedule.includes(m) && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="font-medium text-sm text-gray-700">{m}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    className="w-full mt-8 h-14 text-lg font-bold bg-[#FF6B35] hover:bg-[#e55a2b] text-white shadow-lg shadow-orange-200 rounded-xl transition-all hover:scale-[1.02]"
                                >
                                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" /> Generate My Plan
                                </Button>
                            </Card>
                        </div>
                    </div>
                )}

                {/* STEP 2: LOADING - CẢI TIẾN GIAO DIỆN */}
                {step === 2 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                        <div className="relative w-32 h-32 mb-8">
                            {/* Vòng tròn loading animation */}
                            <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[#FF6B35] rounded-full border-t-transparent animate-spin"></div>

                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Cooking up your plan...</h3>
                        <p className="text-gray-500 mb-6 min-h-[24px]">{loadingText}</p>

                        {/* Thanh Progress Bar */}
                        <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-[#FF6B35] h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${loadingProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{loadingProgress}% Complete</p>
                    </div>
                )}

                {/* STEP 3: RESULT GRID */}
                {step === 3 && result && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">

                        {/* Error Handling */}
                        {result.error ? (
                            <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg border border-red-100">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
                                <p className="text-gray-600 mb-6">{result.error}</p>
                                <Button onClick={() => setStep(1)} variant="outline" className="w-full">Try Again</Button>
                            </div>
                        ) : (
                            <div>
                                {/* Analysis Banner */}
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-start">
                                    <div className="p-4 bg-orange-50 rounded-2xl shrink-0">
                                        <Leaf className="w-8 h-8 text-[#FF6B35]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Chef's Analysis</h2>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{result.analysis}</p>
                                    </div>
                                    <Button onClick={() => setStep(1)} variant="outline" className="ml-auto shrink-0 border-gray-200 text-gray-600">
                                        Create New Plan
                                    </Button>
                                </div>

                                {/* Weekly Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {result.days?.map((day: any, dayIndex: number) => (
                                        <Card key={dayIndex} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                                            {/* Header Ngày */}
                                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">{day.day}</h3>
                                                {dayIndex === 0 && (
                                                    <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-1 rounded-full">TODAY</span>
                                                )}
                                            </div>

                                            {/* Danh sách Bữa ăn */}
                                            <div className="p-4 space-y-4">
                                                {day.meals.map((meal: Meal, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => meal.recipeId && navigate(`/recipe/${meal.recipeId}`)}
                                                        className={`relative flex gap-3 p-2 rounded-xl transition-all cursor-pointer hover:bg-orange-50/50 ${!meal.recipeId && 'opacity-70 pointer-events-none'}`}
                                                    >
                                                        {/* Ảnh nhỏ */}
                                                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                                                            <img
                                                                src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150"}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* Thông tin */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-0.5">
                                                                <span className="text-[10px] font-bold text-[#FF6B35] uppercase">{meal.type}</span>
                                                                <span className="text-[10px] text-gray-400">{meal.calories} kcal</span>
                                                            </div>
                                                            <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-1 group-hover:text-[#FF6B35] transition-colors">
                                                                {meal.recipeName}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="mt-12 text-center">
                                    <Button className="h-12 px-8 rounded-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white shadow-lg">
                                        Save This Plan
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}