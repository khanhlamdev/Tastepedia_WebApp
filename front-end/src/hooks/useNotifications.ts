import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api';

export interface Notification {
    id: string;
    recipientUserId: string;
    type: string; // LIKE_POST | LIKE_COMMENT | COMMENT_POST | REPLY_COMMENT | SYSTEM | ORDER | PROMO
    actorName: string;
    actorAvatar: string;
    message: string;
    link: string;
    read: boolean;
    createdAt: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClientRef = useRef<Client | null>(null);

    // Lấy user từ localStorage
    const getUser = () => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    // Fetch danh sách thông báo từ API
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/notifications`, { withCredentials: true });
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
        } catch {
            // Chưa đăng nhập hoặc lỗi, ignore
        }
    }, []);

    // Kết nối WebSocket STOMP
    useEffect(() => {
        const user = getUser();
        if (!user?.id) return;

        // Fetch thông báo ban đầu
        fetchNotifications();

        // Kết nối WebSocket
        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_URL.replace('/api', '')}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                // Subscribe vào channel riêng của user
                client.subscribe(`/topic/notifications/${user.id}`, (frame) => {
                    const newNotification: Notification = JSON.parse(frame.body);

                    // Thêm vào đầu danh sách
                    setNotifications((prev) => [newNotification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    // Hiển thị toast popup
                    const icon = getToastIcon(newNotification.type);
                    toast(newNotification.message, {
                        description: newNotification.actorName,
                        icon,
                        duration: 5000,
                        action: {
                            label: 'Xem',
                            onClick: () => {
                                window.location.href = newNotification.link || '/notifications';
                            },
                        },
                    });
                });
            },
            onDisconnect: () => {
                // console.log('WebSocket disconnected');
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [fetchNotifications]);

    // Đánh dấu 1 thông báo đã đọc
    const markRead = useCallback(async (id: string) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, { withCredentials: true });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (e) {
            console.error('markRead failed', e);
        }
    }, []);

    // Đánh dấu TẤT CẢ đã đọc
    const markAllRead = useCallback(async () => {
        try {
            await axios.put(`${API_URL}/notifications/read-all`, {}, { withCredentials: true });
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error('markAllRead failed', e);
        }
    }, []);

    // Xóa tất cả thông báo
    const clearAll = useCallback(async () => {
        try {
            await axios.delete(`${API_URL}/notifications/clear`, { withCredentials: true });
            setNotifications([]);
            setUnreadCount(0);
        } catch (e) {
            console.error('clearAll failed', e);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        clearAll,
        refetch: fetchNotifications,
    };
}

// Chọn emoji icon theo loại thông báo
function getToastIcon(type: string): string {
    switch (type) {
        case 'LIKE_POST':
        case 'LIKE_COMMENT':
            return '❤️';
        case 'COMMENT_POST':
            return '💬';
        case 'REPLY_COMMENT':
            return '↩️';
        case 'ORDER':
            return '📦';
        case 'PROMO':
            return '🎁';
        case 'SYSTEM':
        default:
            return '🔔';
    }
}
