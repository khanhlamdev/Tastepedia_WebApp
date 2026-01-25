import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Sparkles, Check, AlertCircle, Clock, DollarSign, Activity, Utensils } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MealPlanningPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result
    const [loadingText, setLoadingText] = useState('Analyzing your body type...');
    const [result, setResult] = useState<any>(null);

    // --- FORM STATE ---
    const [goal, setGoal] = useState('Healthy Living');
    const [activity, setActivity] = useState('Moderately Active');
    const [diet, setDiet] = useState('None');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [dislikes, setDislikes] = useState('');
    const [budget, setBudget] = useState('Date Night');
    const [time, setTime] = useState('30-60 mins');
    const [meals, setMeals] = useState(3);

    const toggleAllergy = (allergy: string) => {
        setAllergies(prev => prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]);
    };

    const handleGenerate = async () => {
        setStep(2);
        const messages = ["Analyzing recipes...", "Checking calories...", "Balancing nutrients...", "Finalizing your menu..."];
        let i = 0;
        const interval = setInterval(() => {
            setLoadingText(messages[i % messages.length]);
            i++;
        }, 1500);

        try {
            const res = await fetch('http://localhost:8080/api/ai/meal-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal, activityLevel: activity, dietaryPreference: diet,
                    allergies, dislikedIngredients: dislikes, budget, cookingTime: time, mealsPerDay: meals
                })
            });
            const data = await res.json();
            setResult(data);
            clearInterval(interval);
            setStep(3);
        } catch (err) {
            console.error(err);
            alert("Failed to generate plan. Please try again.");
            setStep(1);
            clearInterval(interval);
        }
    };

    // --- UI COMPONENTS ---
    const SelectionCard = ({ selected, value, onClick, icon: Icon, title, desc }: any) => (
        <div
            onClick={() => onClick(value)}
            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${selected === value ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${selected === value ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className={`font-bold ${selected === value ? 'text-[#FF6B35]' : 'text-gray-800'}`}>{title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
            </div>
            {selected === value && <div className="absolute top-3 right-3 text-[#FF6B35]"><Check className="w-5 h-5" /></div>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 pb-24">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigate('/home')} className="mb-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                            <Sparkles className="w-8 h-8 text-yellow-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">AI Chef Planner</h1>
                            <p className="text-indigo-100">Your personal nutritionist powered by Gemini AI</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto -mt-16 px-4">
                <Card className="shadow-xl border-0 overflow-hidden">

                    {/* STEP 1: INPUT INPUT */}
                    {step === 1 && (
                        <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> 1. Your Body Goal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {['Weight Loss', 'Muscle Gain', 'Healthy Living', 'Maintenance'].map(g => (
                                        <SelectionCard key={g} selected={goal} value={g} onClick={setGoal} icon={Activity} title={g} desc="Optimized macro-nutrients" />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Utensils className="w-5 h-5 text-indigo-600" /> 2. Diet & Allergies</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {['None', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low Carb'].map(d => (
                                        <button key={d} onClick={() => setDiet(d)} className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${diet === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <Label className="text-gray-600 mb-2 block">Allergies (Select all that apply)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Tree Nuts'].map(a => (
                                            <Badge
                                                key={a}
                                                variant={allergies.includes(a) ? "default" : "outline"}
                                                className={`cursor-pointer px-3 py-1.5 text-sm ${allergies.includes(a) ? 'bg-red-500 hover:bg-red-600 border-red-500' : 'hover:bg-red-50 hover:text-red-600 border-gray-300'}`}
                                                onClick={() => toggleAllergy(a)}
                                            >
                                                {a}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Label>Dislikes (Optional)</Label>
                                    <Input placeholder="e.g. Cilantro, Okra, Durian..." value={dislikes} onChange={e => setDislikes(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><DollarSign className="w-5 h-5 text-indigo-600" /> 3. Budget & Time</h3>
                                    <div className="space-y-3">
                                        <Label>Budget Level</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Budget', 'Standard', 'Premium'].map(b => (
                                                <button key={b} onClick={() => setBudget(b)} className={`py-2 rounded-lg border font-medium text-xs ${budget === b ? 'bg-green-100 text-green-700 border-green-500' : 'bg-gray-50 border-transparent text-gray-500'}`}>{b}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Max Cooking Time</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['15 mins', '30-45 mins', 'Unlimited'].map(t => (
                                                <button key={t} onClick={() => setTime(t)} className={`py-2 rounded-lg border font-medium text-xs ${time === t ? 'bg-blue-100 text-blue-700 border-blue-500' : 'bg-gray-50 border-transparent text-gray-500'}`}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-600" /> 4. Structure</h3>
                                    <Label>Meals per Day: {meals}</Label>
                                    <input type="range" min="2" max="6" value={meals} onChange={e => setMeals(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>2</span><span>3 (Standard)</span><span>4</span><span>5</span><span>6</span>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 rounded-xl">
                                <Sparkles className="w-5 h-5 mr-2 animate-pulse" /> Generate My Plan
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: LOADING */}
                    {step === 2 && (
                        <div className="p-20 flex flex-col items-center justify-center text-center">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                <ChefHat className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Cooking up your plan...</h3>
                            <p className="text-gray-500 animate-pulse">{loadingText}</p>
                        </div>
                    )}

                    {/* STEP 3: RESULT */}
                    {step === 3 && result && (
                        <div className="p-0 animate-in fade-in duration-500">
                            <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                                <h2 className="text-xl font-bold text-indigo-900 mb-2">🎯 AI Analysis</h2>
                                <p className="text-indigo-700 leading-relaxed">{result.analysis}</p>
                            </div>

                            <div className="p-6">
                                <Tabs defaultValue={result.days[0]?.day} className="w-full">
                                    <ScrollArea className="w-full whitespace-nowrap mb-6">
                                        <TabsList className="flex w-max space-x-2 bg-transparent">
                                            {result.days.map((day: any) => (
                                                <TabsTrigger
                                                    key={day.day}
                                                    value={day.day}
                                                    className="rounded-full px-6 py-2 border border-gray-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
                                                >
                                                    {day.day}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </ScrollArea>

                                    {result.days.map((day: any) => (
                                        <TabsContent key={day.day} value={day.day} className="space-y-4">
                                            {day.meals.map((meal: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">
                                                        {meal.type === 'Breakfast' ? '🍳' : meal.type === 'Lunch' ? '🥗' : '🍖'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">{meal.type}</Badge>
                                                            <span className="text-sm font-bold text-green-600">{meal.calories} kcal</span>
                                                        </div>
                                                        <h3 className="font-bold text-lg text-gray-800 mb-1">{meal.recipeName}</h3>
                                                        <p className="text-sm text-gray-500 italic mb-2">"{meal.reason}"</p>
                                                        <Button variant="link" className="p-0 h-auto text-indigo-600">View Recipe →</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <Button onClick={() => setStep(1)} variant="outline" className="w-full mt-8 h-12 border-gray-300">Start Over</Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
