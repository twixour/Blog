import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navigation = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const menuItems = [
        { id: 1, name: 'Home', link: '/', icon: 'fa-solid fa-house', requiresAuth: false },
        { id: 2, name: 'Create Blog', link: '/createblog', icon: 'fa-solid fa-box', requiresAuth: true },
        { id: 3, name: 'Own Post', link: '/ownpost', icon: 'fa-solid fa-box', requiresAuth: true },
        //{ id: 3, name: 'Cart', link: '/cart', icon: 'fa-solid fa-cart-shopping' },
    ];
    const [activeLink, setActiveLink] = useState(location.pathname);
    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    return (
        <nav className="bg-blue-800 fixed top-0 left-0 right-0 z-50 mb-16">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center rounded-xl bg-blue-700">
                            <span className="text-white px-3 text-xl font-bold"> Blog <i className="fa-solid fa-shop"></i></span>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {menuItems.map(({ id, name, link, icon, requiresAuth }) => (
                                    !requiresAuth || currentUser ? (
                                        <Link
                                            key={id}
                                            to={link}
                                            className={`rounded-md px-3 py-2 text-sm font-medium ${activeLink === link ? 'bg-blue-900 text-white' : 'text-blue-300 hover:bg-blue-600 hover:text-white'}`}
                                            onClick={() => setActiveLink(link)}
                                        >
                                            {name} <i className={icon}></i>
                                        </Link>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:block ml-auto">
                        {currentUser ? (
                            <button
                                className="text-blue-300 hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                className="text-blue-300 hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                to="/login"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {menuItems.map(({ id, name, link }) => (
                        <Link
                            key={id}
                            to={link}
                            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                        >
                            {name}
                        </Link>
                    ))}
                </div>
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {currentUser ? (
                        <button
                            className="text-blue-300 hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            className="text-blue-300 hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                            to="/login"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
