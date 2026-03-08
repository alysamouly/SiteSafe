import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function Privacy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <Link to="/" className="font-data text-xs uppercase tracking-widest text-dark/50 hover:text-accent transition-colors flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Home
                </Link>
                <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Privacy Policy</h1>
                <p className="font-data text-dark/60 mt-4 text-sm">Last updated: March 2026</p>
            </div>

            <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-8 lg:p-12 space-y-8">
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Data Collection</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        SiteSafe AI Inspector collects images uploaded by users for the purpose of AI-powered hazard analysis. Images are processed in real-time and are not permanently stored on our servers. Analysis results are stored locally in your browser session.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Use of Data</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        Uploaded images are sent to Google's Gemini API for analysis. We do not sell, share, or distribute your data to third parties beyond what is necessary for the hazard analysis service.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Cookies &amp; Local Storage</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        This application uses browser local storage to maintain inspection records and report data during your session. No tracking cookies are used.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Contact</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        For privacy-related inquiries, please contact us through the application's settings page.
                    </p>
                </div>
            </div>
        </div>
    );
}
