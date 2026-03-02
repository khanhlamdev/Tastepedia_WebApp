import { useState, useEffect } from 'react';
import { Heart, Clock, Flame, Star } from 'lucide-react';
import { Badge } from './ui/badge';

interface FavoritesPageProps {
    onNavigate: (page: string, recipeId?: string) => void;
}

interface Recipe {
    id: string;
    title: string;
    mainImageUrl: string;
    cookTime: number;
    totalCost: number;
    cuisine: string;
    dietaryType?: string[];
    nutrition?: { calories: number };
    rating?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function FavoritesPage({ onNavigate }: FavoritesPageProps) {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/favorites`, {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFavorite = async (recipeId: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/favorites/${recipeId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setFavorites(favorites.filter(r => r.id !== recipeId));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-32 md:pb-8">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-[#FF6B35] fill-[#FF6B35]" />
                        <div>
                            <h1 className="text-3xl font-bold">Yêu thích</h1>
                            <p className="text-gray-600 mt-1">{favorites.length} công thức đã lưu</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B35]"></div>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={recipe.mainImageUrl}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                                        onClick={() => onNavigate('recipe', recipe.id)}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(recipe.id);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                                    >
                                        <Heart className="w-5 h-5 text-[#FF6B35] fill-[#FF6B35]" />
                                    </button>
                                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                                        {recipe.dietaryType?.map(dt => (
                                            <Badge key={dt} className="bg-green-500/90 backdrop-blur-sm text-white border-0">
                                                {dt}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Badge className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 shadow-sm">
                                        ${recipe.totalCost}
                                    </Badge>
                                </div>
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => onNavigate('recipe', recipe.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg line-clamp-1 flex-1 mr-2">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm bg-orange-50 px-2 py-1 rounded-full text-orange-600">
                                            <Star className="w-3 h-3 fill-orange-600" />
                                            <span className="font-bold">{recipe.rating || 4.5}</span>
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

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {recipe.cuisine}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Chưa có công thức yêu thích</h3>
                        <p className="text-gray-500 mb-6">
                            Hãy thả tim vào những công thức bạn thích để lưu lại đây nhé!
                        </p>
                        <button
                            onClick={() => onNavigate('search')}
                            className="px-6 py-3 bg-[#FF6B35] text-white rounded-full font-semibold hover:bg-[#ff5722] transition-colors"
                        >
                            Khám phá công thức
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
