import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Trash2, CheckCircle2, XCircle, Plus, BookOpen, Clock, Tag } from 'lucide-react';
import './admin.css';

interface Recipe {
    id: string;
    title: string;
    authorName: string;
    cookTime: number;
    difficulty: string;
    isApproved: boolean;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    type: string;
}

export function AdminRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form states for new category
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [newCatType, setNewCatType] = useState('mealCourse');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const [recRes, catRes] = await Promise.all([
                axios.get(`${API_BASE}/api/admin/recipes`, { withCredentials: true }),
                axios.get(`${API_BASE}/api/admin/categories`, { withCredentials: true })
            ]);
            setRecipes(recRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu recipes/categories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.put(`${API_BASE}/api/admin/recipes/${id}/approve`, { isApproved: !currentStatus }, { withCredentials: true });
            fetchData();
        } catch (error) {
            console.error("Lỗi duyệt công thức:", error);
        }
    };

    const handleDeleteRecipe = async (id: string) => {
        if (!window.confirm("Xóa vĩnh viễn công thức này khỏi hệ thống?")) return;
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.delete(`${API_BASE}/api/admin/recipes/${id}`, { withCredentials: true });
            fetchData();
        } catch (error) {
            console.error("Lỗi xóa công thức:", error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.post(`${API_BASE}/api/admin/categories`, {
                name: newCatName,
                description: newCatDesc,
                type: newCatType
            }, { withCredentials: true });
            setNewCatName('');
            setNewCatDesc('');
            fetchData();
            alert("Thêm danh mục thành công!");
        } catch (error) {
            console.error("Lỗi thêm danh mục:", error);
            alert("Thêm danh mục thất bại.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Xóa danh mục này? Các món ăn đang dùng tag này có thể bị ảnh hưởng.")) return;
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.delete(`${API_BASE}/api/admin/categories/${id}`, { withCredentials: true });
            fetchData();
        } catch (error) {
            console.error("Lỗi xóa danh mục:", error);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-amber-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium">Đang tải trung tâm dữ liệu món ăn...</p>
            </div>
        </div>
    );

    return (
        <div className="admin-page-container">
            {/* Header Section */}
            <div className="admin-header-card">
                <div className="admin-header-info">
                    <div className="admin-icon-box" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)' }}>
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h1 className="admin-header-title-text">Quản Lý Kho Công Thức</h1>
                        <p className="admin-header-desc-text">Duyệt bài đăng mới và quản trị hệ thống phân loại Món ăn.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="recipes" className="w-full">
                <TabsList className="admin-tabs-list">
                    <TabsTrigger value="recipes" className="admin-tab-trigger">
                        Duyệt Công Thức
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="admin-tab-trigger">
                        Quản Lý Danh Mục
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="admin-table-wrapper">
                        <div className="admin-table-responsive">
                            <Table>
                                <TableHeader className="admin-table-header">
                                    <TableRow>
                                        <TableHead className="admin-table-head-cell min-w-[250px]">Tên Công Thức</TableHead>
                                        <TableHead className="admin-table-head-cell">Tác Giả</TableHead>
                                        <TableHead className="admin-table-head-cell">Độ Khó / T.Gian</TableHead>
                                        <TableHead className="admin-table-head-cell">Trạng Thái</TableHead>
                                        <TableHead className="admin-table-head-cell text-right">Hành Động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recipes.map(recipe => (
                                        <TableRow key={recipe.id} className="admin-table-row hover-orange">
                                            <TableCell className="admin-table-cell">
                                                <span className="admin-text-bold inline-block" style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = '#ea580c'} onMouseOut={e => e.currentTarget.style.color = '#111827'}>
                                                    {recipe.title}
                                                </span>
                                            </TableCell>
                                            <TableCell className="admin-table-cell">
                                                <span className="admin-badge admin-badge-gray">
                                                    {recipe.authorName}
                                                </span>
                                            </TableCell>
                                            <TableCell className="admin-table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span className={`admin-badge ${recipe.difficulty === 'Dễ' ? 'admin-badge-emerald' :
                                                        recipe.difficulty === 'Vừa' ? 'admin-badge-amber' : 'admin-badge-red'
                                                        }`}>
                                                        {recipe.difficulty}
                                                    </span>
                                                    <span className="admin-badge admin-badge-gray">
                                                        <Clock size={12} /> {recipe.cookTime} phút
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="admin-table-cell">
                                                {recipe.isApproved ? (
                                                    <span className="admin-badge admin-badge-emerald">
                                                        <CheckCircle2 size={14} /> Đã Phê Duyệt
                                                    </span>
                                                ) : (
                                                    <span className="admin-badge admin-badge-amber">
                                                        <Clock size={14} /> Chờ Duyệt
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="admin-table-cell text-right">
                                                <div className="admin-action-group">
                                                    {recipe.isApproved ? (
                                                        <button className="admin-btn admin-btn-action-outline h-9" onClick={() => handleToggleApproval(recipe.id, recipe.isApproved)}>
                                                            <XCircle size={16} /> Gỡ Bỏ
                                                        </button>
                                                    ) : (
                                                        <button className="admin-btn admin-btn-action-primary h-9" onClick={() => handleToggleApproval(recipe.id, recipe.isApproved)}>
                                                            <CheckCircle2 size={16} /> Duyệt Bài
                                                        </button>
                                                    )}
                                                    <button className="admin-btn admin-btn-action-ghost h-9 px-2" onClick={() => handleDeleteRecipe(recipe.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recipes.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16">
                                                <div className="admin-empty-state">
                                                    <BookOpen className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                                                    <p className="admin-text-medium">Chưa có công thức nào trong hệ thống.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Form Thêm Mới */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-1 rounded-3xl shadow-lg h-fit">
                                <div className="bg-white p-6 rounded-[22px] h-full flex flex-col">
                                    <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                                        <Tag className="text-orange-500" size={24} /> Thêm Danh Mục
                                    </h3>
                                    <form onSubmit={handleAddCategory} className="space-y-5 flex-1 flex flex-col">
                                        <div className="admin-form-group">
                                            <div style={{ width: '100%' }}>
                                                <label className="admin-label">Tên Danh Mục</label>
                                                <input required value={newCatName} onChange={e => setNewCatName(e.target.value)} type="text" className="admin-input" placeholder="VD: Bữa Sáng" />
                                            </div>
                                        </div>
                                        <div className="admin-form-group">
                                            <div style={{ width: '100%' }}>
                                                <label className="admin-label">Cách Phân Loại</label>
                                                <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="admin-input appearance-none cursor-pointer">
                                                    <option value="mealCourse">Meal / Course (Theo bữa)</option>
                                                    <option value="dietaryType">Dietary (Chế độ ăn)</option>
                                                    <option value="cuisine">Cuisine (Vùng miền)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="admin-form-group flex-1">
                                            <div style={{ width: '100%' }}>
                                                <label className="admin-label">Mô Tả Nhanh</label>
                                                <textarea value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} rows={3} className="admin-input resize-none" placeholder="Dành cho các món ăn bồi bổ buổi sáng..."></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" className="admin-btn h-12 mt-2 w-full" style={{ backgroundColor: '#111827', color: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                                            <Plus size={18} /> Tạo Mới Danh Mục
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Bảng Danh Mục Hiện Tại */}
                        <div className="w-full lg:w-2/3">
                            <div className="admin-table-wrapper">
                                <div className="admin-table-responsive">
                                    <Table>
                                        <TableHeader className="admin-table-header">
                                            <TableRow>
                                                <TableHead className="admin-table-head-cell w-[30%]">Tên Danh Mục</TableHead>
                                                <TableHead className="admin-table-head-cell">Loại</TableHead>
                                                <TableHead className="admin-table-head-cell">Mô Tả</TableHead>
                                                <TableHead className="admin-table-head-cell text-right">Hành Động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map(cat => (
                                                <TableRow key={cat.id} className="admin-table-row">
                                                    <TableCell className="admin-table-cell admin-text-bold">{cat.name}</TableCell>
                                                    <TableCell className="admin-table-cell">
                                                        <span className={`admin-badge ${cat.type === 'mealCourse' ? 'admin-badge-amber' :
                                                            cat.type === 'dietaryType' ? 'admin-badge-emerald' : 'admin-badge-indigo'
                                                            }`}>
                                                            {cat.type}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="admin-table-cell admin-text-medium" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {cat.description || '--'}
                                                    </TableCell>
                                                    <TableCell className="admin-table-cell text-right">
                                                        <button className="admin-btn admin-btn-action-ghost h-9 px-2" onClick={() => handleDeleteCategory(cat.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {categories.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-16">
                                                        <div className="admin-empty-state">
                                                            <Tag className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                                                            <p className="admin-text-medium">Chưa có danh mục nào.</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
