import { useState } from 'react';
import { Salad, Dumbbell, Clock, Globe, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const goals = [
    { id: 'healthy', icon: Salad, label: 'Eat Healthy', color: 'bg-green-50 border-green-200' },
    { id: 'muscle', icon: Dumbbell, label: 'Muscle Gain', color: 'bg-orange-50 border-orange-200' },
    { id: 'quick', icon: Clock, label: 'Quick Cooking', color: 'bg-blue-50 border-blue-200' },
    { id: 'explore', icon: Globe, label: 'Explore Cuisine', color: 'bg-purple-50 border-purple-200' },
  ];

  const allergies = [
    'Peanut', 'Seafood', 'Gluten-free', 'Dairy', 'Eggs', 'Soy', 'Tree Nuts', 'Shellfish'
  ];

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6 md:p-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Step {step} of 3</h3>
            <button onClick={() => onComplete()} className="text-sm text-[#FF6B35] hover:underline">
              Skip
            </button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-[#FF6B35]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Main Goal */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">What is your main goal?</h2>
            <p className="text-gray-600 mb-8">Help us personalize your recipe recommendations</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                        : `${goal.color} hover:border-gray-300`
                    }`}
                  >
                    <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-[#FF6B35]' : 'text-gray-700'}`} />
                    <h3 className="font-semibold text-lg">{goal.label}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Allergies */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Any dietary restrictions?</h2>
            <p className="text-gray-600 mb-8">Select all that apply to filter recipes</p>

            <div className="flex flex-wrap gap-3">
              {allergies.map((allergy) => {
                const isSelected = selectedAllergies.includes(allergy);
                return (
                  <Badge
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-6 py-3 text-base cursor-pointer transition-all hover:scale-105 ${
                      isSelected
                        ? 'bg-[#FF6B35] text-white hover:bg-[#ff5722]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {allergy}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Cuisine Preferences */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">What cuisines do you love?</h2>
            <p className="text-gray-600 mb-8">We'll show you more of what you like</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Vietnamese', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Thai', 'Korean', 'French', 'Chinese'].map((cuisine) => (
                <button
                  key={cuisine}
                  className="p-4 rounded-2xl border-2 border-gray-200 hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all"
                >
                  <span className="text-3xl mb-2 block">🍜</span>
                  <h3 className="font-medium">{cuisine}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 rounded-2xl"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 h-12 rounded-2xl bg-[#FF6B35] hover:bg-[#ff5722] text-white"
          >
            {step === 3 ? 'Finish Setup' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
