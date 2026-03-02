import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Users, FileText, AlertTriangle, TrendingUp, Heart, Star, Flame, Award, RefreshCw } from 'lucide-react';
import './admin.css';

export function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await axios.get(`${API_BASE}/api/admin/analytics`, { withCredentials: true });
            setData(response.data);
        } catch (err: any) {
            console.error("Lỗi khi tải dữ liệu phân tích:", err);
            setError(`Lỗi: ${err.response?.status ?? 'network'} — ${err.response?.data ?? err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (isLoading) return (
        <div className="flex h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-semibold text-lg">Đang tải dữ liệu Dashboard...</p>
            </div>
        </div>
    );

    if (error || !data) return (
        <div className="flex h-[70vh] items-center justify-center">
            <div className="bg-white border border-red-200 p-10 rounded-3xl text-center max-w-md shadow-xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tải được dữ liệu</h3>
                <p className="text-gray-500 mb-2 text-sm">{error ?? 'Không có dữ liệu từ API'}</p>
                <p className="text-gray-400 text-xs mb-6">Backend có thể đang tắt hoặc bạn chưa đăng nhập với quyền Admin.</p>
                <button
                    onClick={fetchAnalytics}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm mx-auto transition-colors"
                >
                    <RefreshCw size={16} /> Thử lại
                </button>
            </div>
        </div>
    );

    const statCards = [
        {
            title: 'Tổng Người Dùng',
            value: data.totalUsers,
            icon: <Users size={26} className="text-white" />,
            bgGrad: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
        },
        {
            title: 'Tổng Bài Viết',
            value: data.totalPosts,
            icon: <FileText size={26} className="text-white" />,
            bgGrad: 'linear-gradient(135deg, #34d399, #14b8a6)',
        },
        {
            title: 'Báo Cáo Chờ Xử Lý',
            value: data.pendingReports,
            icon: <AlertTriangle size={26} className="text-white" />,
            bgGrad: 'linear-gradient(135deg, #fb7185, #e11d48)',
        },
        {
            title: 'Tăng Trưởng Tháng',
            value: '+12%',
            icon: <TrendingUp size={26} className="text-white" />,
            bgGrad: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
        },
    ];

    const BAR_COLORS = ['#F43F5E', '#FB923C', '#FBBF24', '#60A5FA', '#A78BFA'];

    return (
        <div className="admin-dashboard-container">
            {/* Page Header */}
            <div className="admin-page-header">
                <h1 className="admin-page-title">Analytics Overview</h1>
                <p className="admin-page-subtitle">Giám sát hoạt động và tăng trưởng của cộng đồng Tastepedia.</p>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-grid">
                {statCards.map((card, idx) => (
                    <div key={idx} className="admin-stat-card">
                        <div className="admin-stat-icon-wrapper" style={{ background: card.bgGrad }}>
                            {card.icon}
                        </div>
                        <div className="admin-stat-info">
                            <p className="admin-stat-label">{card.title}</p>
                            <p className="admin-stat-value">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="admin-charts-grid">
                {/* Growth Line Chart */}
                <div className="admin-section-card">
                    <div className="admin-section-header">
                        <div className="admin-section-icon" style={{ backgroundColor: '#eff6ff' }}>
                            <TrendingUp style={{ color: '#3b82f6', width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Tăng Trưởng Hoạt Động</h3>
                            <p className="admin-section-subtitle">7 ngày gần nhất</p>
                        </div>
                    </div>
                    <div className="admin-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.growthChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '10px 16px', color: '#111' }}
                                    labelStyle={{ fontWeight: 700, margin: '0 0 4px 0' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: 16, fontSize: 13, fontWeight: 600 }} />
                                <Line type="monotone" name="Người Dùng Mới" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 7, strokeWidth: 0 }} />
                                <Line type="monotone" name="Bài Viết Mới" dataKey="posts" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 7, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Tags Bar Chart */}
                <div className="admin-section-card">
                    <div className="admin-section-header">
                        <div className="admin-section-icon" style={{ backgroundColor: '#fff1f2' }}>
                            <Flame style={{ color: '#f43f5e', width: '20px', height: '20px' }} />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Tags Xu Hướng</h3>
                            <p className="admin-section-subtitle">Top 5 tags phổ biến nhất</p>
                        </div>
                    </div>
                    <div className="admin-chart-container">
                        {data.topTags && data.topTags.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.topTags} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} width={90} />
                                    <Tooltip
                                        cursor={{ fill: '#fafafa' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '10px 16px' }}
                                    />
                                    <Bar dataKey="value" name="Số bài viết" radius={[0, 8, 8, 0]} barSize={28}>
                                        {data.topTags.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="admin-empty-state" style={{ height: '100%' }}>
                                <Star className="admin-empty-state-icon" />
                                <span className="admin-empty-state-text">Chưa đủ dữ liệu để phân tích</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Posts Engagement */}
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <div className="admin-section-icon" style={{ backgroundColor: '#fff7ed' }}>
                        <Award style={{ color: '#f97316', width: '20px', height: '20px' }} />
                    </div>
                    <div>
                        <h3 className="admin-section-title">Top Bài Đăng Sôi Nổi Nhất</h3>
                        <p className="admin-section-subtitle">Dựa trên tổng lượt tương tác (like + comment)</p>
                    </div>
                </div>

                {data.topPosts && data.topPosts.length > 0 ? (
                    <div className="admin-posts-list">
                        {data.topPosts.map((post: any, idx: number) => (
                            <div key={post.id} className="admin-post-item">
                                {/* Rank Badge */}
                                <div className={`admin-rank-badge ${idx === 0 ? 'admin-rank-1' : idx === 1 ? 'admin-rank-2' : idx === 2 ? 'admin-rank-3' : 'admin-rank-other'}`}>
                                    {idx + 1}
                                </div>

                                {/* Post content */}
                                <div className="admin-post-info">
                                    <p className="admin-post-title">
                                        "{post.title}"
                                    </p>
                                    <div className="admin-post-author-wrapper">
                                        <div className="admin-post-author-avatar">
                                            {post.author?.charAt(0)?.toUpperCase() ?? '?'}
                                        </div>
                                        <span className="admin-post-author-name">{post.author}</span>
                                    </div>
                                </div>

                                {/* Engagement */}
                                <div className="admin-engagement-badge">
                                    <Heart size={13} style={{ fill: 'currentColor' }} />
                                    <span className="admin-engagement-value">{post.engagement}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="admin-empty-state pt-8 pb-8">
                        <Heart className="admin-empty-state-icon" />
                        <span className="admin-empty-state-text">Chưa có bài đăng nào nhận được tương tác.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

