import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Rooms from "./pages/Rooms";
import AvailableRooms from "./pages/AvailableRooms";
import MyBookings from "./pages/MyBookings";

import AdminRooms from "./pages/AdminRooms";
import AdminBookings from "./pages/AdminBookings";

import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute"

export default function App() {

    return (

        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/"
                    element={
                        <UserRoute>
                            <Rooms />
                        </UserRoute>
                    }
                />

                <Route
                    path="/available-rooms"
                    element={
                        <UserRoute>
                            <AvailableRooms />
                        </UserRoute>
                    }
                />

                <Route
                    path="/my-bookings"
                    element={
                        <UserRoute>
                            <MyBookings />
                        </UserRoute>
                    }
                />

                <Route
                    path="/admin/rooms"
                    element={
                        <AdminRoute>
                            <AdminRooms />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/bookings"
                    element={
                        <AdminRoute>
                            <AdminBookings />
                        </AdminRoute>
                    }
                />

            </Route>    

            <Route
                path="*"
                element={<Navigate to="/" />}
            />

        </Routes>

    );

}