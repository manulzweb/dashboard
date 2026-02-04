'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConnectionStatus from './ConnectionStatus';

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
        <nav className="bg-[#0a0a0f]/90 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f3ff] to-[#bd00ff] animate-pulse"></div>
                        <Link href="/dashboard" className="font-black text-2xl tracking-tighter text-white uppercase italic">
                            CYBER<span className="text-[#00f3ff]">BOARD</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <ConnectionStatus />
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 rounded-full text-xs font-bold font-mono text-white border border-white/20 hover:bg-white/10 hover:border-[#bd00ff] transition-all duration-300 uppercase tracking-widest cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
