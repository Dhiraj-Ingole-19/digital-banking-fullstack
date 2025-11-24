import React from 'react';
import { Download } from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const InstallApp = () => {
    const { deferredPrompt, isIOS, installApp } = usePwa();

    useEffect(() => {
        console.log('InstallApp mounted. Prompt available:', !!deferredPrompt, 'Is iOS:', isIOS);
    }, [deferredPrompt, isIOS]);

    if (isIOS) {
        return (
            <div className="glass-panel" style={{ padding: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
                📲 To install: Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.
            </div>
        );
    }

    if (!deferredPrompt) return null;

    return (
        <button onClick={installApp} className="btn btn-success" style={{ width: '100%', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Download size={18} /> Install App
        </button>
    );
};

export default InstallApp;
