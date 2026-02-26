import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreVertical, ShieldCheck, UserX, UserCog, BadgeCheck, Users, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import './admin.css';

interface UserData {
    id: string;
    fullName: string;
    email: string;
    role: string;
    verified: boolean;
    profileImageUrl?: string;
}

export function AdminUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/users', { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            if (!window.confirm(`Thay đổi quyền thành ${newRole}?`)) return;
            await axios.put(`http://localhost:8080/api/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi đổi role:", error);
            alert("Cập nhật quyền thất bại.");
        }
    };

    const handleVerify = async (userId: string, currentStatus: boolean) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/users/${userId}/verify`, { verified: !currentStatus }, { withCredentials: true });
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xác minh:", error);
        }
    };

    const handleBan = async (userId: string) => {
        try {
            if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn user này?")) return;
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, { withCredentials: true });
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xóa tài khoản:", error);
            alert("Xóa tài khoản thất bại.");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu người dùng...</p>
            </div>
        </div>
    );

    return (
        <div className="admin-page-container">
            {/* Header Section */}
            <div className="admin-header-card">
                <div className="admin-header-info">
                    <div className="admin-icon-box blue">
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="admin-header-title-text">Quản Lý Người Dùng</h1>
                        <p className="admin-header-desc-text">Phân quyền, xác thực Creator và quản lý cộng đồng.</p>
                    </div>
                </div>
                <div className="admin-search-box">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Tìm theo tên hoặc email..."
                        className="admin-input"
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-table-wrapper">
                <div className="admin-table-responsive">
                    <Table>
                        <TableHeader className="admin-table-header">
                            <TableRow>
                                <TableHead className="admin-table-head-cell min-w-[250px]">Thành Viên</TableHead>
                                <TableHead className="admin-table-head-cell">Liên Hệ (Email)</TableHead>
                                <TableHead className="admin-table-head-cell">Vai Trò</TableHead>
                                <TableHead className="admin-table-head-cell">Trạng Thái</TableHead>
                                <TableHead className="admin-table-head-cell text-right">Hành Động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="admin-table-row hover-blue">
                                    <TableCell className="admin-table-cell">
                                        <div className="admin-user-cell-info">
                                            {user.profileImageUrl && user.profileImageUrl.length > 5 ? (
                                                <img src={user.profileImageUrl} alt="avatar" className="admin-avatar-img" />
                                            ) : (
                                                <div className="admin-avatar-fallback">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className="admin-text-bold" style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = '#2563eb'} onMouseOut={e => e.currentTarget.style.color = '#111827'}>
                                                    {user.fullName}
                                                </span>
                                                <span className="admin-text-sub">ID: {user.id.substring(user.id.length - 6)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="admin-table-cell admin-text-medium">{user.email}</TableCell>
                                    <TableCell className="admin-table-cell">
                                        <span className={`admin-badge ${user.role === 'ADMIN' ? 'admin-badge-red' :
                                            user.role === 'CREATOR' ? 'admin-badge-indigo' :
                                                'admin-badge-gray'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="admin-table-cell">
                                        {user.verified ? (
                                            <span className="admin-badge admin-badge-emerald">
                                                <BadgeCheck size={14} /> Đã Xác Thực
                                            </span>
                                        ) : (
                                            <span className="admin-badge admin-badge-gray" style={{ color: '#6b7280', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                                Chưa Xác Thực
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="admin-table-cell text-right">
                                        <div className="admin-action-group">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors border-none bg-transparent cursor-pointer">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-gray-100 bg-white">
                                                    {user.role !== 'ADMIN' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleVerify(user.id, user.verified)} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 group">
                                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                                                </div>
                                                                <span className="font-semibold text-gray-700 group-hover:text-emerald-700">{user.verified ? 'Bỏ Xác Thực' : 'Xác Thực Danh Tâm'}</span>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === 'USER' ? 'CREATOR' : 'USER')} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 group mt-1">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <UserCog className="h-4 w-4 text-indigo-600" />
                                                                </div>
                                                                <span className="font-semibold text-gray-700 group-hover:text-indigo-700">{user.role === 'USER' ? 'Cấp Quyền Creator' : 'Hạ Quyền Về User'}</span>
                                                            </DropdownMenuItem>

                                                            <div className="h-px bg-gray-100 my-2 mx-2"></div>

                                                            <DropdownMenuItem onClick={() => handleBan(user.id)} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 group">
                                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                    <UserX className="h-4 w-4 text-red-600" />
                                                                </div>
                                                                <span className="font-semibold text-red-600">Xóa vĩnh viễn</span>
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {user.role === 'ADMIN' && (
                                                        <div className="p-3 text-sm text-gray-400 text-center font-medium italic">
                                                            Không thể thao tác Admin
                                                        </div>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
