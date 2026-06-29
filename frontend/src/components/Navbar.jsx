import { useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineCalendarDays } from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar({ onMenuClick }) {

    const navigate = useNavigate();

    const { user } = useAuth();

    function goHome() {

        if (user?.role === "admin") {
            navigate("/admin/rooms");
        } else {
            navigate("/");
        }

    }

    return (

        <nav className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">

            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden"
                        aria-label="Open navigation menu"
                    >

                        <HiOutlineBars3 className="h-5 w-5" />

                    </button>

                    <button
                        type="button"
                        onClick={goHome}
                        className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg"
                    >

                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">

                            <HiOutlineCalendarDays className="h-4 w-4" aria-hidden="true" />

                        </div>

                        <span className="text-lg font-bold tracking-tight text-stone-900">

                            Schedora

                        </span>

                    </button>

                </div>

                <ProfileDropdown />

            </div>

        </nav>

    );

}
