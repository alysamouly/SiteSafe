import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Terms() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <Link to="/" className="font-data text-xs uppercase tracking-widest text-dark/50 hover:text-accent transition-colors flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Home
                </Link>
                <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Terms of Service</h1>
                <p className="font-data text-dark/60 mt-4 text-sm">Last updated: March 2026</p>
            </div>

            <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-8 lg:p-12 space-y-8">
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Acceptance of Terms</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        By accessing and using SiteSafe AI Inspector, you accept and agree to be bound by these terms. If you do not agree, do not use the service.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Service Description</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        SiteSafe AI Inspector provides AI-powered construction site hazard analysis. The service uses computer vision to identify potential safety violations in uploaded photographs.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">Limitations of Liability</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        This tool supplements — but does not replace — manual safety inspections. SiteSafe AI Inspector makes no guarantee that all hazards will be identified. Users must exercise independent judgment and maintain situational awareness at all times on construction sites.
                    </p>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm mb-4">User Responsibilities</h2>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">
                        Users are responsible for verifying all AI-generated safety assessments against established safety protocols and regulations. The ultimate responsibility for site safety remains with qualified personnel.
                    </p>
                </div>
            </div>
        </div>
    );
}
