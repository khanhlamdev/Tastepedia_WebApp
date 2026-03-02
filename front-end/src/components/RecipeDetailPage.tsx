import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Star, Clock, Users, Heart, Share2, ShoppingCart,
  CheckCircle2, ChefHat, Bike,
  ChevronLeft, ChevronRight, Tag, Globe, Video
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar } from './ui/avatar';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';

interface RecipeDetailPageProps {
  onNavigate: (page: string) => void;
  recipeId?: string | null;
}

interface RecipeData {
  id: string;
  title: string;
  description: string;
  cookTime: number;
  prepTime?: number; // NEW: Split time
  servings: number;
  difficulty: string;
  mainImageUrl: string;
  subImageUrls?: string[];

  // --- TRƯỜNG MỚI TỪ BACKEND ---
  dietaryType?: string[];
  cuisine?: string;
  mealCourse?: string[]; // NEW
  kitchenTools?: string[]; // NEW
  allergens?: string[]; // NEW
  chefTips?: string; // NEW
  storageInstruction?: string; // NEW
  videoUrl?: string; // NEW

  ingredients: { name: string; quantity: string; unit: string; price: number }[];
  steps: { stepNumber: number; content: string }[];
  authorName: string;
  totalCost: number;
  createdAt: string;
  nutrition?: {
    calories: number;
    carb: number;
    protein: number;
    fat: number;
  };
}

interface ReviewData {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  createdAt: string;
  comment: string;
  helpfulCount: number;
  isVerified: boolean;
}

import { useParams, useNavigate } from 'react-router-dom';

export function RecipeDetailPage({ onNavigate, recipeId: propRecipeId }: RecipeDetailPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const recipeId = id || propRecipeId; // Prioritize URL param

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ingredientsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recipeId) {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      fetch(`${API_BASE}/api/recipes/${recipeId}`)
        .then(res => res.json())
        .then(data => {
          const mappedData = { ...data, id: data.id || data._id };
          setRecipe(mappedData);
          setCurrentImageIndex(0);
        })
        .catch(err => console.error("Error fetching recipe:", err));
    }
  }, [recipeId]);

  // Check if recipe is favorited
  useEffect(() => {
    if (recipeId) {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      fetch(`${API_BASE}/api/favorites/check/${recipeId}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(isFav => setIsLiked(isFav))
        .catch(err => console.error("Error checking favorite:", err));
    }
  }, [recipeId]);

  const displayIngredients = recipe?.ingredients.map((ing, idx) => ({
    id: `ing-${idx}`,
    name: ing.name,
    amount: `${ing.quantity} ${ing.unit}`,
    price: ing.price || 0,
    inPantry: false
  })) || [];

  const displaySteps = recipe?.steps.map(s => s.content) || [];

  // Mock Restaurants
  const nearbyRestaurants = [
    { id: 'r1', name: 'Pho Thin Restaurant', logo: '🍜', distance: '0.8 km', rating: 4.7, reviews: 234, price: 8.50, deliveryTime: '20-30 min', deliveryFee: 0, image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=400' },
    { id: 'r2', name: 'Mama Kitchen', logo: '👩🍳', distance: '1.2 km', rating: 4.9, reviews: 456, price: 12.00, deliveryTime: '25-35 min', deliveryFee: 2.50, image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=400' },
    { id: 'r3', name: 'Saigon Street Food', logo: '🥢', distance: '2.1 km', rating: 4.6, reviews: 189, price: 7.00, deliveryTime: '30-40 min', deliveryFee: 0, image: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=400' },
  ];

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentRecipeId = recipeId || 'bun-cha-ha-noi';

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleFavorite = async () => {
    if (!recipeId) {
      alert('Không tìm thấy ID công thức!');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      console.log(`Toggling favorite: ${method} ${API_BASE}/api/favorites/${recipeId}`);

      const res = await fetch(`${API_BASE}/api/favorites/${recipeId}`, {
        method,
        credentials: 'include'
      });

      console.log('Response status:', res.status);
      const responseText = await res.text();
      console.log('Response:', responseText);

      if (res.ok) {
        setIsLiked(!isLiked);
        alert(isLiked ? 'Đã xóa khỏi yêu thích!' : 'Đã thêm vào yêu thích!');
      } else if (res.status === 401 || res.status === 403) {
        // Not logged in
        alert('⚠️ Vui lòng đăng nhập để thêm vào yêu thích!');
        navigate('/login');
      } else {
        // Other error
        alert(`Lỗi: ${responseText}`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Lỗi kết nối! Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
    fetch(`${API_BASE}/api/reviews/${currentRecipeId}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, [currentRecipeId]);

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    const savedUserStr = localStorage.getItem('user');
    let currentUser = { _id: "697026a611b1058843f2e32d", fullName: "Guest User", avatar: "G" };
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        currentUser._id = parsed._id || parsed.id || currentUser._id;
        currentUser.fullName = parsed.fullName || currentUser.fullName;
        const nameParts = currentUser.fullName.split(' ');
        const lastInitial = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || "U";
        currentUser.avatar = lastInitial;
      } catch (e) { console.error(e); }
    }

    const reviewPayload = {
      recipeId: currentRecipeId,
      userId: currentUser._id,
      username: currentUser.fullName,
      avatar: currentUser.avatar,
      rating: newRating,
      comment: newComment,
      isVerified: true
    };

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_BASE}/api/reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview, ...reviews]);
        setNewComment('');
        setNewRating(5);
      }
    } catch (error) { console.error("Error posting review:", error); } finally { setIsSubmitting(false); }
  };

  const totalPrice = displayIngredients
    .filter(i => selectedIngredients.includes(i.id) && !i.inPantry)
    .reduce((sum, i) => sum + i.price, 0);

  const scrollToIngredients = () => ingredientsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleOrderReadyMeal = () => setShowRestaurantModal(true);

  const handleAddToCart = () => {
    if (selectedIngredients.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 nguyên liệu để thêm vào giỏ hàng!');
      return;
    }
    const cartItemsToAdd = displayIngredients
      .filter(i => selectedIngredients.includes(i.id))
      .map(i => ({
        id: i.name, // Dùng tên nguyên liệu làm key để CartPage tìm store
        name: i.name,
        image: recipe?.mainImageUrl || "https://images.unsplash.com/photo-1763703544688-2ac7839b0659",
        price: 0, // Giá sẽ được fetch lại bên CartPage tuỳ cửa hàng
        quantity: 1,
        recipe: recipe?.title || 'Unknown Recipe'
      }));

    try {
      const existingCart = JSON.parse(localStorage.getItem('tastepedia_cart') || '[]');
      // Gộp item trùng
      cartItemsToAdd.forEach(newItem => {
        const existing = existingCart.find((item: any) => item.name === newItem.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          existingCart.push(newItem);
        }
      });
      localStorage.setItem('tastepedia_cart', JSON.stringify(existingCart));
      toast.success('Đã thêm nguyên liệu vào giỏ hàng của bạn!');
    } catch (e) {
      console.error('Error saving to cart', e);
      toast.error('Lỗi khi thêm vào giỏ hàng');
    }
  };

  const averageRating = 4.8;
  const totalReviews = reviews.length;

  if (!recipe && recipeId) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const title = recipe?.title || "Bún Chả Hà Nội";
  const description = recipe?.description || "A beloved Vietnamese dish...";
  const fallbackImage = "https://images.unsplash.com/photo-1763703544688-2ac7839b0659";

  // Create unified media array with VIDEO FIRST, then images
  type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

  const allMedia: MediaItem[] = recipe
    ? [
      // VIDEO FIRST
      ...(recipe.videoUrl ? [{ type: 'video' as const, url: recipe.videoUrl }] : []),
      // Then images
      ...(recipe.mainImageUrl ? [{ type: 'image' as const, url: recipe.mainImageUrl }] : []),
      ...(recipe.subImageUrls || []).map(url => ({ type: 'image' as const, url }))
    ].filter(item => item.url && item.url.trim() !== '')
    : [{ type: 'image' as const, url: fallbackImage }];

  const displayMedia = allMedia.length > 0 ? allMedia : [{ type: 'image' as const, url: fallbackImage }];

  const time = recipe?.cookTime || 45;
  const prepTime = recipe?.prepTime || 0;
  const servings = recipe?.servings || 4;
  const stepsToRender = recipe ? displaySteps : [];
  const ingredientsToRender = recipe ? displayIngredients : [];

  const nextMedia = () => setCurrentImageIndex((prev) => (prev + 1) % displayMedia.length);
  const prevMedia = () => setCurrentImageIndex((prev) => (prev - 1 + displayMedia.length) % displayMedia.length);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-32 md:pb-8 scroll-smooth">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 md:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
          <span className="font-semibold text-lg">{title}</span>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /> Back to Home</button>
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">

            {/* MEDIA CAROUSEL (Images + Video) */}
            <div className="relative aspect-video w-full overflow-hidden md:rounded-3xl mb-4 md:mb-6 group bg-gray-100">
              <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {displayMedia.map((media, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={`${title} image ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${media.url.includes('youtube.com') ? new URL(media.url).searchParams.get('v') : media.url.split('/').pop()}`}
                        title={`${title} video`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

              {displayMedia.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10 shadow-lg"><ChevronLeft className="w-6 h-6" /></button>
                  <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10 shadow-lg"><ChevronRight className="w-6 h-6" /></button>
                </>
              )}

              {displayMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {displayMedia.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`} />
                  ))}
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button onClick={toggleFavorite} className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"><Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} /></button>
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"><Share2 className="w-6 h-6 text-gray-700" /></button>
              </div>
            </div>

            <div className="bg-white md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
              <div className="mb-6">
                {/* --- HIỂN THỊ TAGS LOẠI MÓN, QUỐC GIA & MẠT COURSES --- */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Badge Quốc Gia */}
                  {recipe?.cuisine && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1 px-3 py-1">
                      <Globe className="w-3 h-3" /> {recipe.cuisine}
                    </Badge>
                  )}
                  {/* Tags Loại Món (Duyệt qua mảng) */}
                  {recipe?.dietaryType && recipe.dietaryType.map((type, idx) => (
                    <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 flex items-center gap-1 px-3 py-1">
                      <Tag className="w-3 h-3" /> {type}
                    </Badge>
                  ))}
                  {/* Meal Course Badges */}
                  {recipe?.mealCourse && recipe.mealCourse.map((course, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-300 px-3 py-1">
                      {course}
                    </Badge>
                  ))}
                  {/* Video Tutorial Badge */}
                  {recipe?.videoUrl && (
                    <Badge className="bg-red-100 text-red-600 border-red-300 px-3 py-1 flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video hướng dẫn
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
                <p className="text-gray-600 mb-4">{description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <button onClick={scrollToReviews} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded-full transition-all hover:scale-105">
                    <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-gray-500">({totalReviews} reviews)</span>
                  </button>
                  {prepTime > 0 && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-600" /><span>Prep: {prepTime}m</span></div>}
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-red-600" /><span>Cook: {time}m</span></div>
                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-600" /><span>{servings} servings</span></div>
                </div>
              </div>

              {/* Nutrition Info */}
              <div className="grid grid-cols-4 gap-3 p-4 bg-[#F9F9F9] rounded-2xl mb-6">
                <div className="text-center"><div className="text-2xl font-bold text-[#FF6B35]">{recipe?.nutrition?.calories || 0}</div><div className="text-xs text-gray-600">Calories</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-[#4CAF50]">{recipe?.nutrition?.protein || 0}g</div><div className="text-xs text-gray-600">Protein</div></div>
                <div className="text-center"><div className="text-2xl font-bold">{recipe?.nutrition?.fat || 0}g</div><div className="text-xs text-gray-600">Fat</div></div>
                <div className="text-center"><div className="text-2xl font-bold">{recipe?.nutrition?.carb || 0}g</div><div className="text-xs text-gray-600">Carbs</div></div>
              </div>

              {/* Kitchen Tools */}
              {recipe?.kitchenTools && recipe.kitchenTools.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-2xl mb-4 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5" /> Kitchen Tools Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.kitchenTools.map((tool, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white rounded-full text-sm border border-blue-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergen Warnings */}
              {recipe?.allergens && recipe.allergens.length > 0 && (
                <div className="bg-red-50 p-4 rounded-2xl mb-4 border border-red-200">
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    ⚠️ Allergen Warnings
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.allergens.map((allergen, idx) => (
                      <Badge key={idx} className="bg-red-100 text-red-700 border-red-300">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Chef's Tips */}
              {recipe?.chefTips && (
                <div className="bg-yellow-50 p-4 rounded-2xl mb-4 border border-yellow-200">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-yellow-700" /> Chef's Tips
                  </h3>
                  <p className="text-gray-700">{recipe.chefTips}</p>
                </div>
              )}

              {/* Storage Instructions */}
              {recipe?.storageInstruction && (
                <div className="bg-indigo-50 p-4 rounded-2xl mb-4 border border-indigo-200">
                  <h3 className="font-bold text-indigo-900 mb-2">📦 Storage Instructions</h3>
                  <p className="text-gray-700">{recipe.storageInstruction}</p>
                </div>
              )}

              <Separator className="my-6" />

              {/* Ingredients */}
              <div className="mb-6" ref={ingredientsRef}>
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <div className="space-y-3">
                  {ingredientsToRender.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-start gap-3">
                      <Checkbox id={ingredient.id} checked={selectedIngredients.includes(ingredient.id)} onCheckedChange={() => toggleIngredient(ingredient.id)} className="mt-1" />
                      <label htmlFor={ingredient.id} className="flex-1 cursor-pointer">
                        <div className="flex items-baseline justify-between">
                          <span className={selectedIngredients.includes(ingredient.id) ? 'line-through text-gray-500' : ''}>{ingredient.name}</span>
                          {ingredient.inPantry && <Badge variant="secondary" className="text-xs">In Pantry</Badge>}
                        </div>
                        <div className="text-sm text-gray-500">{ingredient.amount}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Steps */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <div className="space-y-4">
                  {stepsToRender.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-semibold">{idx + 1}</div>
                      <p className="flex-1 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6" ref={reviewsRef}>
              <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
              <div className="mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <h3 className="font-semibold mb-3">Leave a Review</h3>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setNewRating(star)} type="button"><Star className={`w-6 h-6 ${star <= newRating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'}`} /></button>))}
                </div>
                <Textarea placeholder="Share your thoughts..." className="bg-white mb-3" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <div className="flex justify-end"><Button onClick={handleSubmitReview} disabled={isSubmitting} className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full">{isSubmitting ? 'Posting...' : 'Post Review'}</Button></div>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10 border-2 border-primary"><div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full text-sm font-bold">{review.avatar}</div></Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><span className="font-semibold">{review.username}</span>{review.isVerified && <Badge className="bg-[#4CAF50] text-white text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>}</div>
                        <div className="flex items-center gap-2 mb-2"><div className="flex">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'}`} />))}</div><span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span></div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="bg-white md:rounded-3xl p-4 md:p-6">
              <h3 className="font-semibold mb-3">Recipe by</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-semibold text-lg">{recipe?.authorName ? recipe.authorName.charAt(0).toUpperCase() : 'CM'}</div>
                <div className="flex-1"><div className="font-semibold">{recipe?.authorName || 'Chef Minh'}</div><div className="text-sm text-gray-500">Master Chef</div></div>
                <Button variant="outline" className="rounded-full">Follow</Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Shop this Recipe</h3>
                <div className="space-y-3 mb-6">
                  {ingredientsToRender.filter(i => !i.inPantry).map((ingredient) => {
                    const isSelected = selectedIngredients.includes(ingredient.id);
                    return (
                      <div key={ingredient.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isSelected ? 'bg-[#FF6B35]/5' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 flex-1"><Checkbox checked={isSelected} onCheckedChange={() => toggleIngredient(ingredient.id)} /><div className="flex-1"><div className="text-sm font-medium">{ingredient.name}</div><div className="text-xs text-gray-500">{ingredient.amount}</div></div></div>
                        <div className="font-semibold">{ingredient.price.toLocaleString('vi-VN')} đ</div>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center mb-4"><span className="font-semibold">Total:</span><span className="text-2xl font-bold text-[#FF6B35]">{totalPrice.toLocaleString('vi-VN')} đ</span></div>
                <Button onClick={handleAddToCart} className="w-full h-12 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full mb-3"><ShoppingCart className="w-5 h-5 mr-2" />Add to Cart & Delivery</Button>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />Delivery in 30-45 mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-gray-200 shadow-2xl lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-600">Ingredient Cost:</span><span className="text-xl font-bold text-[#FF6B35]">{totalPrice.toLocaleString('vi-VN')} đ</span></div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={scrollToIngredients} className="h-14 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-2xl font-semibold text-sm transition-all hover:scale-105 shadow-lg"><ChefHat className="w-5 h-5 mr-2" /><div className="text-left"><div>Cook It</div><div className="text-xs opacity-90">{totalPrice.toLocaleString('vi-VN')} đ</div></div></Button>
            <Button onClick={handleOrderReadyMeal} className="h-14 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-2xl font-semibold text-sm transition-all hover:scale-105 shadow-lg"><Bike className="w-5 h-5 mr-2" /><div className="text-left"><div>Order It</div><div className="text-xs opacity-90">from 35.000 đ</div></div></Button>
          </div>
        </div>
      </div>

      <Dialog open={showRestaurantModal} onOpenChange={setShowRestaurantModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl">Order Bún Chả from Nearby Restaurants</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            {nearbyRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#4CAF50]">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"><img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" /><div className="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lg">{restaurant.logo}</div></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{restaurant.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" /><span className="font-medium">{restaurant.rating}</span></div><span>•</span><span>{restaurant.distance}</span><span>•</span><span>{restaurant.deliveryTime}</span></div>
                    <div className="flex items-center justify-between"><div><div className="text-xl font-bold text-[#4CAF50]">${restaurant.price.toFixed(2)}</div><div className="text-xs text-gray-500">{restaurant.deliveryFee === 0 ? <span className="text-[#4CAF50] font-medium">Free Delivery</span> : <span>+ ${restaurant.deliveryFee} delivery</span>}</div></div><Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full">Order Now</Button></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}