'use client';

import { useState } from 'react';
import {
  Salad, Dumbbell, Clock, ChevronRight, ChefHat, Brain,
  Sparkles, DollarSign, Flame, Check
} from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const TOTAL_STEPS = 6;

  // --- DATA STATE ---
  const [data, setData] = useState({
    goal: null as string | null,
    diet: null as string | null,
    allergies: [] as string[],
    skillLevel: null as string | null,
    cookingTime: null as string | null,
    cuisines: [] as string[],
  });

  // --- CONFIGURATION ARRAYS ---

  // 1. Goals
  const goals = [
    { id: 'healthy', icon: Salad, label: 'Eat Healthy', desc: 'More veggies, less processed' },
    { id: 'muscle', icon: Dumbbell, label: 'Muscle Gain', desc: 'High protein meals' },
    { id: 'quick', icon: Clock, label: 'Quick & Easy', desc: 'Under 30 mins' },
    { id: 'save', icon: DollarSign, label: 'Budget Friendly', desc: 'Save money cooking' },
    { id: 'learn', icon: Brain, label: 'Learn to Cook', desc: 'Master new skills' },
    { id: 'explore', icon: Sparkles, label: 'Explore Tastes', desc: 'Try new things' },
  ];

  // 2. Diets
  const diets = [
    { id: 'omnivore', label: 'Omnivore', desc: 'I eat everything' },
    { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, please' },
    { id: 'vegan', label: 'Vegan', desc: 'Plant-based only' },
    { id: 'keto', label: 'Keto', desc: 'Low carb, high fat' },
    { id: 'paleo', label: 'Paleo', desc: 'Whole foods only' },
    { id: 'pescatarian', label: 'Pescatarian', desc: 'Fish & veggies' },
  ];

  // 3. Allergies
  const allergies = ['Peanut', 'Seafood', 'Gluten', 'Dairy', 'Eggs', 'Soy', 'Tree Nuts', 'Shellfish'];

  // 4. Skills - Mỗi cấp độ có màu khác nhau
  const skills = [
    {
      id: 'beginner',
      label: 'Beginner',
      icon: ChefHat,
      desc: 'I can boil water',
      // Màu xanh lá cho Beginner
      color: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'text-green-500',
        activeBg: 'bg-green-100'
      }
    },
    {
      id: 'intermediate',
      label: 'Home Cook',
      icon: Flame,
      desc: 'I cook regularly',
      // Màu cam cho Home Cook
      color: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: 'text-orange-500',
        activeBg: 'bg-orange-100'
      }
    },
    {
      id: 'advanced',
      label: 'Pro Chef',
      icon: Sparkles,
      desc: 'I can cook anything',
      // Màu tím cho Pro Chef
      color: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: 'text-purple-500',
        activeBg: 'bg-purple-100'
      }
    },
  ];

  // 5. Time
  const times = [
    { id: '15', label: '< 15 mins', desc: 'Super fast' },
    { id: '30', label: '30 mins', desc: 'Standard meal' },
    { id: '60', label: '1 hour+', desc: 'Weekend cooking' },
  ];

  // 6. Cuisines
  const cuisines = [
    { id: 'vn', label: 'Vietnamese', flag: '🇻🇳' },
    { id: 'it', label: 'Italian', flag: '🇮🇹' },
    { id: 'jp', label: 'Japanese', flag: '🇯🇵' },
    { id: 'kr', label: 'Korean', flag: '🇰🇷' },
    { id: 'cn', label: 'Chinese', flag: '🇨🇳' },
    { id: 'in', label: 'Indian', flag: '🇮🇳' },
    { id: 'th', label: 'Thai', flag: '🇹🇭' },
    { id: 'mx', label: 'Mexican', flag: '🇲🇽' },
    { id: 'fr', label: 'French', flag: '🇫🇷' },
    { id: 'us', label: 'American', flag: '🇺🇸' },
  ];

  // --- LOGIC HANDLERS ---

  const updateData = (key: keyof typeof data, value: any) => {
    setData({ ...data, [key]: value });
  };

  const toggleArrayItem = (key: 'allergies' | 'cuisines', item: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
          ? prev[key].filter(i => i !== item)
          : [...prev[key], item]
    }));
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
      } else {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const updatedUser = { ...user, preferences: data, hasCompletedOnboarding: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        onComplete();
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (step > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
      <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col min-h-[720px] relative mx-auto overflow-hidden">

          {/* TOP BAR: Step Count & Skip */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold bg-orange-50 text-[#FF6B35] px-4 py-1.5 rounded-full tracking-wider">
              BƯỚC {step}/{TOTAL_STEPS}
            </span>
            </div>
            <button
                onClick={onComplete}
                className="text-sm font-bold text-gray-400 hover:text-[#FF6B35] transition-colors px-4 py-2 hover:bg-orange-50 rounded-lg"
            >
              Bỏ qua
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="flex gap-2.5 mb-12">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
                        idx + 1 <= step ? 'bg-[#FF6B35]' : 'bg-gray-100'
                    }`}
                />
            ))}
          </div>

          {/* --- DYNAMIC CONTENT AREA --- */}
          <div className={`flex-1 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

            {/* STEP 1: GOAL */}
            {step === 1 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Mục tiêu của bạn là gì?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Chúng tôi sẽ gợi ý món ăn phù hợp nhất với bạn.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {goals.map((g) => {
                      const isActive = data.goal === g.id;
                      return (
                          <button
                              key={g.id}
                              onClick={() => updateData('goal', g.id)}
                              className={`
                        relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                        hover:shadow-xl hover:-translate-y-1 group
                        ${isActive
                                  ? 'border-[#FF6B35] bg-[#FFF5F0]'
                                  : 'border-gray-100 bg-white hover:border-[#FF6B35]/30'
                              }
                      `}
                          >
                            <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm
                        ${isActive
                                ? 'bg-[#FF6B35] text-white'
                                : 'bg-gray-50 text-gray-600 group-hover:bg-orange-50 group-hover:text-[#FF6B35]'
                            }
                      `}>
                              <g.icon size={28} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{g.label}</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{g.desc}</p>

                            {isActive && (
                                <div className="absolute top-5 right-5 text-[#FF6B35] bg-white rounded-full p-1 shadow-sm">
                                  <Check size={20} strokeWidth={3} />
                                </div>
                            )}
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* STEP 2: DIET */}
            {step === 2 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Chế độ ăn uống?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Chọn chế độ phù hợp với lối sống của bạn.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {diets.map((d) => {
                      const isActive = data.diet === d.id;
                      return (
                          <button
                              key={d.id}
                              onClick={() => updateData('diet', d.id)}
                              className={`
                        p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between
                        hover:shadow-lg hover:border-[#FF6B35]/30 group hover:-translate-y-1
                        ${isActive ? 'border-[#FF6B35] bg-[#FFF5F0]' : 'border-gray-100 bg-white'}
                      `}
                          >
                            <div>
                              <h3 className={`font-bold text-xl mb-1 transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-gray-900'}`}>
                                {d.label}
                              </h3>
                              <p className="text-sm font-medium text-gray-500">{d.desc}</p>
                            </div>

                            <div className={`
                        w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all
                        ${isActive ? 'border-[#FF6B35] bg-[#FF6B35] shadow-md' : 'border-gray-200 group-hover:border-[#FF6B35] bg-gray-50'}
                      `}>
                              {isActive && <Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* STEP 3: ALLERGIES */}
            {step === 3 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Dị ứng thực phẩm?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Chúng tôi sẽ loại bỏ các món chứa thành phần này.</p>

                  <div className="flex flex-wrap gap-4">
                    {allergies.map((allergy) => {
                      const isActive = data.allergies.includes(allergy);
                      return (
                          <button
                              key={allergy}
                              onClick={() => toggleArrayItem('allergies', allergy)}
                              className={`
                        px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                        hover:-translate-y-1 hover:shadow-md
                        ${isActive
                                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-200 ring-2 ring-[#FF6B35] ring-offset-2'
                                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35]'
                              }
                      `}
                          >
                            {allergy}
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* STEP 4: SKILL LEVEL - VỚI 3 MÀU KHÁC NHAU */}
            {step === 4 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Trình độ nấu nướng?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Hãy trung thực nhé, AI sẽ hướng dẫn phù hợp! 😉</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skills.map((s) => {
                      const isActive = data.skillLevel === s.id;
                      return (
                          <button
                              key={s.id}
                              onClick={() => updateData('skillLevel', s.id)}
                              className={`
                        p-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-6 transition-all duration-300
                        hover:shadow-2xl hover:-translate-y-2 group
                        ${isActive
                                  ? `border-[#FF6B35] bg-[#FFF5F0] shadow-xl` // Khi chọn vẫn dùng màu cam chủ đạo
                                  : `border-gray-100 bg-white hover:border-[${s.color.border}] hover:shadow-lg`
                              }
                      `}
                          >
                            {/* Icon với màu riêng của từng cấp độ */}
                            <div className={`
                        w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${isActive
                                ? 'bg-white shadow-inner scale-110 ring-4 ring-orange-50'
                                : `${s.color.bg} shadow-md group-hover:scale-105`
                            }
                      `}>
                              <s.icon
                                  size={48}
                                  strokeWidth={1.5}
                                  className={`transition-colors ${isActive ? 'text-[#FF6B35]' : s.color.icon}`}
                              />
                            </div>

                            <div className="text-center">
                              {/* Tiêu đề với màu riêng */}
                              <h3 className={`font-bold text-2xl mb-2 transition-colors ${
                                  isActive ? 'text-[#FF6B35]' : s.color.text
                              }`}>
                                {s.label}
                              </h3>
                              <p className="text-base font-medium text-gray-500">{s.desc}</p>
                            </div>

                            {/* Dấu check khi chọn */}
                            {isActive && (
                                <div className="absolute top-5 right-5 bg-[#FF6B35] text-white rounded-lg p-1 shadow-lg">
                                  <Check size={20} strokeWidth={3} />
                                </div>
                            )}
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* STEP 5: TIME */}
            {step === 5 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Thời gian nấu nướng?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Thời gian trung bình bạn dành cho một bữa ăn.</p>

                  <div className="space-y-5">
                    {times.map((t) => {
                      const isActive = data.cookingTime === t.id;
                      return (
                          <button
                              key={t.id}
                              onClick={() => updateData('cookingTime', t.id)}
                              className={`
                        w-full p-6 rounded-2xl border-2 flex items-center gap-6 transition-all duration-300
                        hover:shadow-lg hover:border-[#FF6B35]/30 group hover:-translate-x-1
                        ${isActive ? 'border-[#FF6B35] bg-[#FFF5F0]' : 'border-gray-100 bg-white'}
                      `}
                          >
                            <div className={`
                        p-4 rounded-xl transition-colors shadow-sm
                        ${isActive ? 'bg-[#FF6B35] text-white' : 'bg-gray-50 text-gray-400 group-hover:text-[#FF6B35] group-hover:bg-orange-50'}
                      `}>
                              <Clock size={28} strokeWidth={1.5} />
                            </div>

                            <div className="text-left flex-1">
                              <h3 className={`font-bold text-xl ${isActive ? 'text-[#FF6B35]' : 'text-gray-900'}`}>{t.label}</h3>
                              <p className="text-sm font-medium text-gray-500">{t.desc}</p>
                            </div>

                            {/* Radio Circle */}
                            <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                        ${isActive ? 'border-[#FF6B35]' : 'border-gray-200 bg-gray-50'}
                      `}>
                              {isActive && <div className="w-4 h-4 bg-[#FF6B35] rounded-full shadow-sm" />}
                            </div>
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* STEP 6: CUISINES */}
            {step === 6 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Ẩm thực yêu thích?</h1>
                  <p className="text-gray-500 mb-10 text-lg font-medium">Chọn bao nhiêu tùy thích.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {cuisines.map((c) => {
                      const isActive = data.cuisines.includes(c.id);
                      return (
                          <button
                              key={c.id}
                              onClick={() => toggleArrayItem('cuisines', c.id)}
                              className={`
                        relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4
                        hover:shadow-xl hover:-translate-y-2 hover:border-[#FF6B35]/30 group
                        ${isActive
                                  ? 'border-[#FF6B35] bg-[#FFF5F0]'
                                  : 'border-gray-100 bg-white'
                              }
                      `}
                          >
                            <div className="text-6xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{c.flag}</div>
                            <h3 className={`font-bold text-base transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-gray-700 group-hover:text-[#FF6B35]'}`}>
                              {c.label}
                            </h3>

                            {isActive && (
                                <div className="absolute top-4 right-4 bg-[#FF6B35] text-white rounded-lg p-1 shadow-sm">
                                  <Check size={16} strokeWidth={4} />
                                </div>
                            )}
                          </button>
                      );
                    })}
                  </div>
                </div>
            )}

          </div>

          {/* --- FOOTER NAVIGATION --- */}
          <div className="mt-12 flex gap-6 pt-8 border-t border-gray-100/50">

            {/* NÚT BACK: Rộng ra (min-w-[160px]), Bo tròn, Cao (h-16) */}
            {step > 1 && (
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="h-16 min-w-[160px] rounded-full border-2 border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  Quay lại
                </Button>
            )}

            {/* NÚT NEXT: Đầy đặn, nổi bật */}
            <Button
                onClick={handleNext}
                disabled={isTransitioning}
                className={`
              flex-1 h-16 rounded-full text-xl font-bold transition-all duration-300 shadow-xl shadow-orange-200/80
              ${isTransitioning ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-orange-300'}
              bg-[#FF6B35] hover:bg-[#E85A20] text-white tracking-wide
            `}
            >
              {step === TOTAL_STEPS ? 'Hoàn tất & Khám phá' : 'Tiếp tục'}
              <ChevronRight className="w-6 h-6 ml-2" strokeWidth={3} />
            </Button>
          </div>

        </div>
      </div>
  );
}