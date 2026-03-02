import { useState, useEffect } from 'react';
import { ChefHat, Clock, Flame, Star, Pencil, Trash2, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MyRecipesPageProps {
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

export function MyRecipesPage({ onNavigate }: MyRecipesPageProps) {
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchMyRecipes();
    }, []);

    const fetchMyRecipes = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/recipes/my-recipes', {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setMyRecipes(data);
            }
        } catch (error) {
            console.error('Error fetching my recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRecipe = async (recipeId: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/recipes/${recipeId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setMyRecipes(myRecipes.filter(r => r.id !== recipeId));
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-32 md:pb-8">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ChefHat className="w-8 h-8 text-[#FF6B35]" />
                            <div>
                                <h1 className="text-3xl font-bold">Công thức của tôi</h1>
                                <p className="text-gray-600 mt-1">{myRecipes.length} công thức đã đăng</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => onNavigate('create-recipe')}
                            className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tạo công thức mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B35]"></div>
                    </div>
                ) : myRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myRecipes.map((recipe) => (
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
                                <div className="p-4">
                                    <div
                                        className="cursor-pointer"
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

                                    {/* Action Buttons */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => onNavigate('edit-recipe', recipe.id)}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Sửa
                                        </Button>
                                        {deleteConfirm === recipe.id ? (
                                            <div className="flex-1 flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1 text-xs"
                                                    onClick={() => deleteRecipe(recipe.id)}
                                                >
                                                    Xác nhận
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={() => setDeleteConfirm(null)}
                                                >
                                                    Hủy
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeleteConfirm(recipe.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Chưa có công thức nào</h3>
                        <p className="text-gray-500 mb-6">
                            Hãy chia sẻ công thức nấu ăn của bạn với cộng đồng!
                        </p>
                        <button
                            onClick={() => onNavigate('create-recipe')}
                            className="px-6 py-3 bg-[#FF6B35] text-white rounded-full font-semibold hover:bg-[#ff5722] transition-colors"
                        >
                            Tạo công thức đầu tiên
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
