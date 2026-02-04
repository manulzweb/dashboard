'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        // In a real app, call an API to clear cookie.
        // For now, we simulate logout by clearing cookie client-side or just redirecting
        // But better to have a server action or API route.
        // We will assume the user just wants to be redirected for this demo, 
        // or we can add a simple server action later.
        // Let's manually expire the cookie for simplicity if strictly client side, 
        // or better, just redirect to login.
        document.cookie = 'bitunix_dashboard_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
        router.refresh();
    };

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/dashboard" className="font-bold text-xl tracking-tight text-blue-400">
                            Crypto Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
