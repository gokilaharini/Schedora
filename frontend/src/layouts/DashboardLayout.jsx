import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="min-h-screen bg-[#faf6f4]">

            <Navbar
                onMenuClick={() => setSidebarOpen(true)}
            />

            <div className="flex">

                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}
