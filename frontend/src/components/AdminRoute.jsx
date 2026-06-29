import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {

    const { user } = useAuth();

    useEffect(() => {

        if (user && user.role !== "admin") {
            toast.error("Access denied. You are not authorized to access this page.");
        }

    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
