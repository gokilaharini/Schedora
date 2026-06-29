import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function UserRoute({ children }) {

    const { user } = useAuth();

    useEffect(() => {

        if (user && user.role !== "user") {
            toast.error("Access denied. You are not authorized to access this page.");
        }

    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "user") {
        return <Navigate to="/admin/rooms" replace />;
    }

    return children;

}
