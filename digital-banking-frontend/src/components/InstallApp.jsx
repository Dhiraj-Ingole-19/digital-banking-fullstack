import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        console.log('InstallApp component mounted');
        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);
        if (isIosDevice) console.log('Device detected as iOS');

        // Capture install event (Android/Desktop)
        const handler = (e) => {
            console.log('beforeinstallprompt event fired!', e);
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isIOS) {
        return (
            <div className="glass-panel" style={{ padding: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
                📲 To install: Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.
            </div>
        );
    }

    if (!deferredPrompt) return null;

    return (
        <button onClick={handleInstall} className="btn btn-success" style={{ width: '100%', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Download size={18} /> Install App
        </button>
    );
};

export default InstallApp;
