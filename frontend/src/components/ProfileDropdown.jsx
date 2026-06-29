import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineArrowRightOnRectangle,
    HiOutlineChevronDown,
    HiOutlineUserCircle
} from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";

export default function ProfileDropdown() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }

        }

        function handleEscape(event) {

            if (event.key === "Escape") {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);

        };

    }, []);

    function handleLogout() {

        logout();

        navigate("/login");

    }

    const initials = user?.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?";

    return (

        <div ref={containerRef} className="relative">

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Open profile menu"
            >

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">

                    {initials}

                </span>

                <span className="hidden max-w-[120px] truncate font-medium text-stone-800 sm:inline">

                    {user?.name}

                </span>

                <HiOutlineChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />

            </button>

            {open && (

                <div
                    className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-stone-200 bg-white py-2 shadow-lg"
                    role="menu"
                >

                    <div className="border-b border-stone-100 px-4 py-3">

                        <div className="flex items-center gap-3">

                            <HiOutlineUserCircle className="h-10 w-10 text-stone-300" aria-hidden="true" />

                            <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-stone-900">

                                    {user?.name}

                                </p>

                                <p className="truncate text-xs text-stone-500">

                                    {user?.email}

                                </p>

                                <p className="mt-0.5 text-xs capitalize text-brand-600">

                                    {user?.role}

                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50"
                        role="menuitem"
                    >

                        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />

                        Logout

                    </button>

                </div>

            )}

        </div>

    );

}
