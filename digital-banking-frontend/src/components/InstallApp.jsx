import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // 2. Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        // 3. Capture install event
        const handler = (e) => {
            e.preventDefault();
            console.log("PWA Install Prompt Captured"); // Debug log
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if event already fired (rare but possible in some envs)
        if (window.deferredPrompt) {
            setDeferredPrompt(window.deferredPrompt);
            window.deferredPrompt = null;
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    // Don't show if already installed
    if (isInstalled) return null;

    // iOS Instruction
    if (isIOS) {
        return (
            <div className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                📲 Install App: Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.
            </div>
        );
    }

    // Android / Desktop Button
    if (!deferredPrompt) {
        // Optional: Show a disabled button or nothing if not installable yet
        return null;
    }

    return (
        <button onClick={handleInstall} className="btn btn-success" style={{ width: '100%', marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <Download size={18} /> Install DigiBank App
        </button>
    );
};

export default InstallApp;
