import { NavLink } from "react-router-dom";

export default function Navbar() {
    // Helper to style active links
    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md transition-all duration-200 ${isActive
            ? "bg-white/20 text-white shadow-md"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`;

    return (
        <nav className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <NavLink
                    to="/"
                    className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-50 to-red-50 bg-clip-text text-transparent hover:from-gray-200 hover:to-white transition-all">My Word
                </NavLink>

                <div className="flex gap-2">
                    <NavLink to="/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/create" className={linkClass}>
                        Create Post
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}