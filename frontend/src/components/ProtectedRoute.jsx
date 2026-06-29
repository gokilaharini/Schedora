import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const {
        loading,
        isLoggedIn
    } = useAuth();

    if (loading) {

        return (
            <div className="h-screen flex items-center justify-center text-lg">
                Loading...
            </div>
        );

    }

    if (!isLoggedIn) {

        return <Navigate to="/login" replace />;

    }

    return children;

}