import { NavLink } from "react-router-dom";
import {
    HiOutlineBuildingOffice2,
    HiOutlineCheckCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineCog6Tooth,
    HiOutlineXMark
} from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";

const iconMap = {
    "/": HiOutlineBuildingOffice2,
    "/available-rooms": HiOutlineCheckCircle,
    "/my-bookings": HiOutlineClipboardDocumentList,
    "/admin/rooms": HiOutlineCog6Tooth,
    "/admin/bookings": HiOutlineClipboardDocumentList
};

export default function Sidebar({ isOpen, onClose }) {

    const { user } = useAuth();

    const userLinks = [
        {
            name: "All Rooms",
            path: "/"
        },
        {
            name: "Available Rooms",
            path: "/available-rooms"
        },
        {
            name: "My Bookings",
            path: "/my-bookings"
        }
    ];

    const adminLinks = [
        {
            name: "Manage Rooms",
            path: "/admin/rooms"
        },
        {
            name: "View All Bookings",
            path: "/admin/bookings"
        }
    ];

    const links = user?.role === "admin"
        ? adminLinks
        : userLinks;

    const navContent = (

        <nav className="flex flex-col gap-1 p-4 pt-6">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-brand-200/80">

                {user?.role === "admin" ? "Administration" : "Navigation"}

            </p>

            {links.map((link) => {

                const Icon = iconMap[link.path];

                return (

                    <NavLink

                        key={link.path}

                        to={link.path}

                        onClick={onClose}

                        className={({ isActive }) =>

                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                                isActive
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-brand-100 hover:bg-white/10 hover:text-white"
                            }`

                        }

                    >

                        {Icon && (

                            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />

                        )}

                        {link.name}

                    </NavLink>

                );

            })}

        </nav>

    );

    return (

        <>

            {isOpen && (

                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                    aria-label="Close navigation menu"
                />

            )}

            <aside

                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-brand-700 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:min-h-[calc(100vh-56px)] lg:translate-x-0 lg:shadow-none ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}

            >

                <div className="flex items-center justify-between border-b border-white/10 p-4 lg:hidden">

                    <span className="text-sm font-semibold text-white">

                        Menu

                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-brand-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        aria-label="Close menu"
                    >

                        <HiOutlineXMark className="h-5 w-5" />

                    </button>

                </div>

                <div className="hidden border-b border-white/10 px-6 py-5 lg:block">

                    <p className="text-lg font-bold text-white">

                        Schedora

                    </p>

                    <p className="text-xs text-brand-200">

                    Book the Right Room, Every Time.

                    </p>

                </div>

                {navContent}

            </aside>

        </>

    );

}
