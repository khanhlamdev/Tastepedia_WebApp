'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface SlideImage {
    id: number;
    url: string;
    title: string;
    description: string;
}

const HERO_SLIDES: SlideImage[] = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
        title: 'Fresh Ingredients',
        description: 'Get the freshest ingredients delivered to your door'
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
        title: 'Easy Recipes',
        description: 'Follow step-by-step recipes with stunning visuals'
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
        title: 'Community Cooking',
        description: 'Join thousands of home chefs and food lovers'
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1504674900967-77d84e1f07eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
        title: 'Food Delivery',
        description: 'Order pre-prepared ingredients for busy days'
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080',
        title: 'AI-Powered Chef',
        description: 'Let AI suggest recipes based on what you have'
    },
];

export function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlay]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        setIsAutoPlay(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsAutoPlay(false);
    };

    return (
        <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
            {/* Slides Container */}
            <div
                className="relative w-full overflow-hidden bg-gray-900"
                style={{ height: '500px', backgroundColor: 'orange' }} // <--- THÊM DÒNG NÀY
            >
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={slide.url || "/placeholder.svg"}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-pretty">{slide.title}</h2>
                            <p className="text-sm md:text-lg opacity-90">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentSlide(index);
                            setIsAutoPlay(false);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/70 w-2'
                        }`}
                    />
                ))}
            </div>

            {/* Auto-play Toggle */}
            <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="absolute top-4 right-4 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs transition-all"
            >
                {isAutoPlay ? '⏸' : '▶'}
            </button>
        </div>
    );
}
