import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    BookOpen,
    LogOut,
    ArrowLeft,
    ChefHat
} from 'lucide-react';
import './admin.css';

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        const checkAdmin = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.role === 'ADMIN') {
                        setIsAdmin(true);
                        setAdminUser(user);
                        return;
                    }
                } catch (e) {
                    console.error("Lỗi parse user data", e);
                }
            }
            setIsAdmin(false);
            navigate('/');
        };
        checkAdmin();
    }, [navigate]);

    if (isAdmin === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-700 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium">Đang xác thực quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (isAdmin === false) return null;

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={19} />, label: 'Dashboard', exact: true },
        { path: '/admin/users', icon: <Users size={19} />, label: 'Users & Creators', exact: false },
        { path: '/admin/moderation', icon: <ShieldAlert size={19} />, label: 'Moderation', exact: false },
        { path: '/admin/recipes', icon: <BookOpen size={19} />, label: 'Recipe Catalog', exact: false },
    ];

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/auth/logout', { method: 'POST', credentials: 'include' });
        } finally {
            localStorage.removeItem('user');
            navigate('/auth');
        }
    };

    return (
        <div className="admin-layout-root">
            {/* ===== SIDEBAR ===== */}
            <aside className="admin-sidebar-fixed">
                {/* Logo */}
                <div className="admin-sidebar-logo-box">
                    <div className="admin-sidebar-logo-icon">
                        <ChefHat size={22} color="white" />
                    </div>
                    <div>
                        <p className="admin-sidebar-title">Tastepedia</p>
                        <p className="admin-sidebar-subtitle">Admin Console</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="admin-sidebar-nav">
                    <p className="admin-sidebar-heading">Quản Trị</p>
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-nav-link ${isActive ? 'active' : ''}`}
                            >
                                <span style={{ transition: 'transform 0.2s', transform: isActive ? 'none' : 'scale(1)' }}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}></span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin User Info + Actions */}
                <div className="admin-sidebar-footer">
                    {adminUser && (
                        <div className="admin-user-card">
                            <div className="admin-user-avatar">
                                {adminUser.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {adminUser.fullName || adminUser.username}
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#fca5a5', fontWeight: '500' }}>Administrator</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/')}
                        className="admin-action-btn admin-btn-home"
                    >
                        <ArrowLeft size={17} /> Về Trang Chủ
                    </button>
                    <button
                        onClick={handleLogout}
                        className="admin-action-btn admin-btn-logout"
                    >
                        <LogOut size={17} /> Đăng Xuất
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="admin-main-content">
                {/* Top Bar */}
                <div className="admin-topbar">
                    <div>
                        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {navItems.find(i => i.exact ? location.pathname === i.path : location.pathname.startsWith(i.path))?.label ?? 'Admin Panel'}
                        </h2>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Tastepedia Admin Console</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '9999px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                        Live
                    </div>
                </div>

                {/* Page Content */}
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
