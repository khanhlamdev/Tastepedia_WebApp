import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
    Plus, Image as ImageIcon, Trash2, Upload, ArrowLeft,
    Activity, Tag, Globe, CheckCircle, Package
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

const DIETARY_TYPES = ['Mặn', 'Chay', 'Bánh ngọt', 'Đồ uống', 'Eat Clean/Healthy', 'Không Gluten', 'Low Carb'];
const CUISINES = ['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan', 'Âu Mỹ', 'Ý', 'Khác'];

interface EditRecipePageProps {
    onNavigate: (page: string) => void;
    recipeId?: string | null;
}

export function EditRecipePage({ onNavigate, recipeId }: EditRecipePageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState(CUISINES[0]);
    const [nutrition, setNutrition] = useState({ calories: '', carb: '', protein: '', fat: '' });
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [existingMainImage, setExistingMainImage] = useState<string>('');
    const mainInputRef = useRef<HTMLInputElement>(null);
    const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
    const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
    const [existingSubImages, setExistingSubImages] = useState<string[]>([]);
    const subInputRef = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState([{ id: 1, name: '', quantity: '', unit: '', price: '' }]);
    const [steps, setSteps] = useState([{ id: Date.now(), content: '' }]);
    const [recipeLevel, setRecipeLevel] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load existing recipe data
    useEffect(() => {
        if (recipeId) {
            fetch(`http://localhost:8080/api/recipes/${recipeId}`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title || '');
                    setDescription(data.description || '');
                    setCookTime(data.cookTime?.toString() || '');
                    setServings(data.servings?.toString() || '');
                    setSelectedDietary(data.dietaryType || []);
                    setSelectedCuisine(data.cuisine || CUISINES[0]);
                    setNutrition({
                        calories: data.nutrition?.calories?.toString() || '',
                        carb: data.nutrition?.carb?.toString() || '',
                        protein: data.nutrition?.protein?.toString() || '',
                        fat: data.nutrition?.fat?.toString() || ''
                    });
                    setExistingMainImage(data.mainImageUrl || '');
                    setMainImagePreview(data.mainImageUrl || '');
                    setExistingSubImages(data.subImageUrls || []);
                    setSubImagePreviews(data.subImageUrls || []);
                    setIngredients(data.ingredients?.map((ing: any, idx: number) => ({
                        id: idx + 1,
                        name: ing.name || '',
                        quantity: ing.quantity?.toString() || '',
                        unit: ing.unit || '',
                        price: ing.price?.toString() || ''
                    })) || [{ id: 1, name: '', quantity: '', unit: '', price: '' }]);
                    setSteps(data.steps?.map((step: any) => ({
                        id: step.stepNumber || Date.now(),
                        content: step.content || ''
                    })) || [{ id: Date.now(), content: '' }]);
                    const difficultyMap: { [key: string]: number } = { 'Dễ': 1, 'Vừa': 2, 'Khó': 3 };
                    setRecipeLevel(difficultyMap[data.difficulty] || 1);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error loading recipe:', err);
                    setIsLoading(false);
                });
        }
    }, [recipeId]);

    const handleNutritionChange = (field: string, value: string) => setNutrition(prev => ({ ...prev, [field]: value }));

    const handleMainImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImageFile(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (subImageFiles.length + existingSubImages.length) < 4) {
            setSubImageFiles([...subImageFiles, file]);
            setSubImagePreviews([...subImagePreviews, URL.createObjectURL(file)]);
        }
        if (e.target) e.target.value = '';
    };

    const removeSubImage = (index: number) => {
        setSubImageFiles(subImageFiles.filter((_, i) => i !== index));
        setSubImagePreviews(subImagePreviews.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (id: number, field: string, value: string) =>
        setIngredients(ingredients.map(item => item.id === id ? { ...item, [field]: value } : item));

    const addIngredientRow = () => setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: '', price: '' }]);

    const removeIngredientRow = (id: number) => ingredients.length > 1 && setIngredients(ingredients.filter(item => item.id !== id));

    const toggleDietary = (type: string) => {
        if (selectedDietary.includes(type)) {
            setSelectedDietary(selectedDietary.filter(item => item !== type));
        } else {
            setSelectedDietary([...selectedDietary, type]);
        }
    };

    const totalCost = ingredients.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('⚠️ Vui lòng nhập tên món ăn!');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            const recipeData = {
                title,
                description,
                cookTime: parseInt(cookTime) || 0,
                servings: parseInt(servings) || 0,
                difficulty: ['Dễ', 'Vừa', 'Khó'][recipeLevel - 1],
                dietaryType: selectedDietary,
                cuisine: selectedCuisine,
                ingredients: ingredients.map(ing => ({
                    name: ing.name,
                    quantity: ing.quantity,
                    unit: ing.unit,
                    price: parseFloat(ing.price) || 0
                })),
                steps: steps.map((step, idx) => ({
                    stepNumber: idx + 1,
                    content: step.content
                })),
                nutrition: {
                    calories: parseInt(nutrition.calories) || 0,
                    carb: parseInt(nutrition.carb) || 0,
                    protein: parseInt(nutrition.protein) || 0,
                    fat: parseInt(nutrition.fat) || 0
                },
                totalCost
            };

            formData.append('data', JSON.stringify(recipeData));

            if (mainImageFile) {
                formData.append('mainImage', mainImageFile);
            }

            subImageFiles.forEach((file) => formData.append('subImages', file));

            const response = await fetch(`http://localhost:8080/api/recipes/${recipeId}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                alert('✅ Cập nhật công thức thành công!');
                onNavigate('my-recipes');
            } else {
                const errorText = await response.text();
                alert('❌ Lỗi: ' + errorText);
            }
        } catch (error) {
            alert('❌ Không thể kết nối tới server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 py-8 px-4 pb-32 md:pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('my-recipes')}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Chỉnh sửa <span className="text-[#FF6B35]">Công thức</span>
                        </h1>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin công thức của bạn</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-[#FF6B35]">
                                <CardTitle className="text-white">Thông tin Công Thức</CardTitle>
                                <CardDescription className="text-white/80">Chỉnh sửa thông tin món ăn</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <Label className="text-base font-semibold">Tên món ăn</Label>
                                    <Input
                                        placeholder="Ví dụ: Bún Chả Hà Nội..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-lg h-12 border-orange-200"
                                    />
                                </div>

                                <div>
                                    <Label className="text-base font-semibold">Mô tả</Label>
                                    <Textarea
                                        placeholder="Mô tả hương vị, điểm đặc biệt..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[100px] border-orange-200"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Thời gian (phút)</Label>
                                        <Input
                                            type="number"
                                            value={cookTime}
                                            onChange={(e) => setCookTime(e.target.value)}
                                            className="border-orange-200"
                                        />
                                    </div>
                                    <div>
                                        <Label>Khẩu phần</Label>
                                        <Input
                                            type="number"
                                            value={servings}
                                            onChange={(e) => setServings(e.target.value)}
                                            className="border-orange-200"
                                        />
                                    </div>
                                    <div>
                                        <Label>Độ khó</Label>
                                        <div className="flex gap-2 pt-2">
                                            {['Dễ', 'Vừa', 'Khó'].map((level, idx) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setRecipeLevel(idx + 1)}
                                                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${recipeLevel === idx + 1
                                                            ? 'bg-[#FF6B35] text-white'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Dietary Types */}
                                <div>
                                    <Label className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-orange-600" /> Loại món
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {DIETARY_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => toggleDietary(type)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedDietary.includes(type)
                                                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                                        : 'bg-white text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                {selectedDietary.includes(type) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cuisine */}
                                <div>
                                    <Label className="flex items-center gap-2 mb-3">
                                        <Globe className="w-4 h-4 text-blue-600" /> Ẩm thực Quốc gia
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {CUISINES.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setSelectedCuisine(c)}
                                                className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all border ${selectedCuisine === c
                                                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                                        : 'bg-white text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Nutrition */}
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <Label className="flex items-center gap-2 mb-3 text-orange-800 font-semibold">
                                        <Activity className="w-5 h-5" /> Thông tin dinh dưỡng
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500">Calories (kcal)</Label>
                                            <Input
                                                type="number"
                                                value={nutrition.calories}
                                                onChange={(e) => handleNutritionChange('calories', e.target.value)}
                                                className="border-orange-200 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Carb (g)</Label>
                                            <Input
                                                type="number"
                                                value={nutrition.carb}
                                                onChange={(e) => handleNutritionChange('carb', e.target.value)}
                                                className="border-orange-200 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Protein (g)</Label>
                                            <Input
                                                type="number"
                                                value={nutrition.protein}
                                                onChange={(e) => handleNutritionChange('protein', e.target.value)}
                                                className="border-orange-200 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Fat (g)</Label>
                                            <Input
                                                type="number"
                                                value={nutrition.fat}
                                                onChange={(e) => handleNutritionChange('fat', e.target.value)}
                                                className="border-orange-200 bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Steps */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Hướng dẫn chi tiết</Label>
                                    {steps.map((step, index) => (
                                        <div key={step.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <Textarea
                                                value={step.content}
                                                onChange={(e) => {
                                                    const newSteps = [...steps];
                                                    newSteps[index].content = e.target.value;
                                                    setSteps(newSteps);
                                                }}
                                                placeholder={`Bước ${index + 1}: Mô tả chi tiết...`}
                                                className="flex-1 border-0 bg-transparent min-h-[60px]"
                                            />
                                            {steps.length > 1 && (
                                                <button
                                                    onClick={() => setSteps(steps.filter((_, i) => i !== index))}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={() => setSteps([...steps, { id: Date.now(), content: '' }])}
                                        className="w-full border-dashed text-[#FF6B35] border-orange-200"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Thêm bước mới
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                    <ImageIcon className="text-orange-600" /> Hình ảnh
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${mainImagePreview ? 'border-orange-500 p-0' : 'border-orange-200'
                                            }`}
                                        onClick={() => !mainImagePreview && mainInputRef.current?.click()}
                                    >
                                        {mainImagePreview ? (
                                            <>
                                                <img src={mainImagePreview} className="w-full h-64 object-cover rounded-xl" alt="Main" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMainImageFile(null);
                                                        setMainImagePreview(existingMainImage);
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 mx-auto mb-2 text-orange-500" />
                                                <p className="font-bold">Tải ảnh chính</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={mainInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleMainImageUpload}
                                        />
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Ảnh phụ ({subImagePreviews.length}/4)</Label>
                                        <input
                                            type="file"
                                            ref={subInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleSubImageUpload}
                                        />
                                        <div className="grid grid-cols-4 gap-3">
                                            {subImagePreviews.map((img, index) => (
                                                <div key={index} className="aspect-square relative rounded-xl overflow-hidden border">
                                                    <img src={img} className="w-full h-full object-cover" alt={`Sub ${index + 1}`} />
                                                    <button
                                                        onClick={() => removeSubImage(index)}
                                                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {subImagePreviews.length < 4 && (
                                                <div
                                                    onClick={() => subInputRef.current?.click()}
                                                    className="aspect-square border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50"
                                                >
                                                    <Plus className="w-8 h-8 text-orange-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Ingredients */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-lg bg-orange-50">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span className="flex gap-2 text-orange-700">
                                        <Package className="text-orange-600" /> Nguyên liệu
                                    </span>
                                    <Badge className="bg-[#FF6B35] text-white text-lg">
                                        ${totalCost.toFixed(2)}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {ingredients.map((item) => (
                                        <div key={item.id} className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Tên"
                                                className="flex-1 bg-white border-orange-200 h-9 text-sm"
                                                value={item.name}
                                                onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="SL"
                                                type="number"
                                                className="w-16 bg-white border-orange-200 h-9 text-sm"
                                                value={item.quantity}
                                                onChange={(e) => handleIngredientChange(item.id, 'quantity', e.target.value)}
                                            />
                                            <Input
                                                placeholder="ĐV"
                                                className="w-16 bg-white border-orange-200 h-9 text-sm"
                                                value={item.unit}
                                                onChange={(e) => handleIngredientChange(item.id, 'unit', e.target.value)}
                                            />
                                            <Input
                                                placeholder="$"
                                                type="number"
                                                className="w-16 bg-white border-orange-200 h-9 text-sm"
                                                value={item.price}
                                                onChange={(e) => handleIngredientChange(item.id, 'price', e.target.value)}
                                            />
                                            <button
                                                onClick={() => removeIngredientRow(item.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={addIngredientRow}
                                    className="w-full border-dashed border-orange-300 text-orange-600"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Thêm dòng
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-lg font-bold text-white bg-[#FF6B35] hover:bg-[#E85A20]"
                                >
                                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật Công thức'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
