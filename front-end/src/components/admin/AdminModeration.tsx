import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2, CheckCircle2, AlertOctagon, MessageSquare, Flag } from 'lucide-react';
import './admin.css';

interface ReportedContent {
    id: string;
    type: 'post' | 'comment';
    content: string;
    authorName: string;
    reportCount: number;
    createdAt: string;
}

export function AdminModeration() {
    const [reportedPosts, setReportedPosts] = useState<ReportedContent[]>([]);
    const [reportedComments, setReportedComments] = useState<ReportedContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/reports', { withCredentials: true });
            const { reportedPosts, reportedComments } = response.data;

            setReportedPosts(reportedPosts.map((p: any) => ({ ...p, type: 'post' })));
            setReportedComments(reportedComments.map((c: any) => ({ ...c, type: 'comment' })));
        } catch (error) {
            console.error("Lỗi khi tải báo cáo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (id: string, type: 'post' | 'comment') => {
        try {
            if (!window.confirm("Xác nhận xóa nội dung vi phạm này?")) return;
            const url = `http://localhost:8080/api/admin/reports/${type}s/${id}`;
            await axios.delete(url, { withCredentials: true });
            fetchReports();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại.");
        }
    };

    const handleDismiss = async (id: string, type: 'post' | 'comment') => {
        try {
            const url = `http://localhost:8080/api/admin/reports/${type}s/${id}/dismiss`;
            await axios.put(url, {}, { withCredentials: true });
            fetchReports();
        } catch (error) {
            console.error("Lỗi bỏ qua báo cáo:", error);
            alert("Bỏ qua báo cáo thất bại.");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium">Đang tải trung tâm kiểm duyệt...</p>
            </div>
        </div>
    );

    const renderReportCard = (item: ReportedContent) => (
        <div key={item.id} className="admin-mod-card">
            <div className="admin-mod-card-bg-blur"></div>

            <div className="admin-mod-content">
                <div className="admin-mod-meta">
                    <span className={`admin-badge ${item.type === 'post' ? 'admin-badge-violet' : 'admin-badge-teal'}`}>
                        {item.type === 'post' ? <Flag size={14} /> : <MessageSquare size={14} />}
                        {item.type}
                    </span>
                    <span className="admin-text-sub inline-block my-0">
                        Tác giả: <strong className="admin-text-bold">{item.authorName}</strong>
                    </span>
                    <div className="admin-badge admin-badge-red" style={{ marginLeft: 'auto' }}>
                        <AlertOctagon size={14} />
                        {item.reportCount} báo cáo
                    </div>
                </div>
                <div className="admin-mod-quote">
                    <p className="admin-mod-quote-text">
                        "{item.content}"
                    </p>
                </div>
            </div>
            <div className="admin-mod-actions">
                <button className="admin-btn admin-btn-action-outline admin-btn-block" onClick={() => handleDismiss(item.id, item.type)}>
                    <CheckCircle2 size={16} /> Bỏ Qua
                </button>
                <button className="admin-btn admin-btn-action-danger admin-btn-block" onClick={() => handleDelete(item.id, item.type)}>
                    <Trash2 size={16} /> Xóa Bỏ
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-page-container">
            {/* Header Section */}
            <div className="admin-header-card">
                <div className="admin-header-info">
                    <div className="admin-icon-box rose">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h1 className="admin-header-title-text">Trung Tâm Kiểm Duyệt</h1>
                        <p className="admin-header-desc-text">Làm sạch cộng đồng bằng cách xử lý các nội dung vi phạm.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Posts Reports */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">{reportedPosts.length}</span>
                            Bài Viết Vi Phạm
                        </h2>
                    </div>
                    {reportedPosts.length === 0 ? (
                        <div className="admin-empty-state pt-12 pb-12 bg-white">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                            <p className="admin-text-medium">Tuyệt vời! Không có bài viết nào bị báo cáo.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reportedPosts.map(renderReportCard)}
                        </div>
                    )}
                </div>

                {/* Comments Reports */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">{reportedComments.length}</span>
                            Bình Luận Vi Phạm
                        </h2>
                    </div>
                    {reportedComments.length === 0 ? (
                        <div className="admin-empty-state pt-12 pb-12 bg-white">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                            <p className="admin-text-medium">Bình luận đang rất sạch sẽ và an toàn.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reportedComments.map(renderReportCard)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

