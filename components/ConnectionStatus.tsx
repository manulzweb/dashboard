'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function ConnectionStatus() {
    const [status, setStatus] = useState<'loading' | 'ok' | 'error' | 'missing'>('loading');

    useEffect(() => {
        fetch('/api/system/status')
            .then(res => res.json())
            .then(data => {
                if (data.configured) {
                    setStatus('ok');
                } else {
                    setStatus('missing');
                }
            })
            .catch(() => setStatus('error'));
    }, []);

    if (status === 'loading') return null;

    if (status === 'missing') {
        return (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                <XCircle className="w-4 h-4" />
                Keys Missing
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
                Connection Error
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
            <CheckCircle className="w-4 h-4" />
            System Ready
        </div>
    );
}
