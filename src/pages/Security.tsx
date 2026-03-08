import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export function Security() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <Link to="/" className="font-data text-xs uppercase tracking-widest text-dark/50 hover:text-accent transition-colors flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Home
                </Link>
                <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Security</h1>
                <p className="font-data text-dark/60 mt-4 text-sm">How we protect your data</p>
            </div>

            <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-8 lg:p-12 space-y-8">
                <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-xl border border-accent/20 shrink-0 mt-1">
                        <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Encryption</h2>
                        <p className="font-data text-dark/70 text-sm leading-relaxed">
                            All data transmitted between your browser and our services uses TLS 1.3 encryption. Image data sent for analysis is encrypted in transit and not stored after processing.
                        </p>
                    </div>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">API Security</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        API keys are stored as environment variables and never exposed in client-side code bundles. All API calls are authenticated and rate-limited.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Data Retention</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        Inspection data is stored locally in your browser session. No personal data or site images are persisted on our servers beyond the duration of the analysis request.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Vulnerability Reporting</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        If you discover a security vulnerability, please report it through the application's settings page. We take all reports seriously and will respond promptly.
                    </p>
                </div>
            </div>
        </div>
    );
}
