import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        return <Navigate to="/auth" replace />;
    }

    const user = JSON.parse(userStr);

    // Force Onboarding if not completed
    if (!user.hasCompletedOnboarding) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}
