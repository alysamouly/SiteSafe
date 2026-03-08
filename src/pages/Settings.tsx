import React, { useState } from 'react';
import { Shield, Bell, HardHat, Save } from 'lucide-react';

type SettingsTab = 'ai' | 'notifications' | 'project';

export function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('ai');

    const tabs = [
        { id: 'ai' as const, label: 'AI Analysis', icon: Shield },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell },
        { id: 'project' as const, label: 'Project Details', icon: HardHat },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between border-b border-dark/10 pb-6 mt-4">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Settings</h1>
                    <p className="font-data text-dark/60 mt-4 text-sm">Manage your compliance preferences and account settings.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="inline-flex items-center justify-center px-6 py-4 bg-dark text-paper font-heading font-bold text-[10px] tracking-widest uppercase rounded-full hover:bg-accent transition-colors">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1">
                    <nav className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full rounded-xl px-4 py-3 flex items-center text-xs font-heading font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id
                                        ? 'bg-dark text-paper'
                                        : 'text-dark hover:bg-dark/5'
                                    }`}
                            >
                                <tab.icon className={`flex-shrink-0 mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-accent' : 'text-dark/40'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Settings Panel */}
                <div className="lg:col-span-2 space-y-6">

                    {/* AI Analysis Tab */}
                    {activeTab === 'ai' && (
                        <div className="bg-paper shadow-sm border border-dark/10 rounded-[2rem] overflow-hidden">
                            <div className="p-6 border-b border-dark/10 bg-background">
                                <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">AI Analysis &amp; Compliance</h2>
                                <p className="font-data text-dark/60 mt-1 text-xs">Configure how strictly the AI evaluates site photos.</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <fieldset>
                                    <legend className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Analysis Strictness</legend>
                                    <p className="font-data text-dark/60 text-xs mb-4 mt-1">Determine the threshold for flagging potential hazards.</p>
                                    <div className="space-y-3">
                                        <label className="flex items-center p-4 rounded-xl border border-dark/10 hover:border-accent/50 cursor-pointer transition-colors">
                                            <input name="strictness" type="radio" className="h-4 w-4 border-dark/30 text-accent focus:ring-accent" />
                                            <div className="ml-4">
                                                <span className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Lenient</span>
                                                <p className="font-data text-dark/50 text-xs mt-0.5">Only flags obvious, high-risk critical hazards</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center p-4 rounded-xl border border-accent/50 bg-accent/5 cursor-pointer transition-colors">
                                            <input name="strictness" type="radio" defaultChecked className="h-4 w-4 border-dark/30 text-accent focus:ring-accent" />
                                            <div className="ml-4">
                                                <span className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Normal</span>
                                                <p className="font-data text-dark/50 text-xs mt-0.5">Balanced detection for everyday compliance</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center p-4 rounded-xl border border-dark/10 hover:border-accent/50 cursor-pointer transition-colors">
                                            <input name="strictness" type="radio" className="h-4 w-4 border-dark/30 text-accent focus:ring-accent" />
                                            <div className="ml-4">
                                                <span className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Strict</span>
                                                <p className="font-data text-dark/50 text-xs mt-0.5">Flags all potential minor deviations and warnings</p>
                                            </div>
                                        </label>
                                    </div>
                                </fieldset>

                                <div className="pt-6 border-t border-dark/10">
                                    <label htmlFor="compliance-standard" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Primary Compliance Standard</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">Which regulatory standard should the AI primarily reference.</p>
                                    <select id="compliance-standard" className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent">
                                        <option>OSHA (United States)</option>
                                        <option>ISO 45001 (International)</option>
                                        <option>HSE (United Kingdom)</option>
                                        <option>Safe Work (Australia)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-paper shadow-sm border border-dark/10 rounded-[2rem] overflow-hidden">
                            <div className="p-6 border-b border-dark/10 bg-background">
                                <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">Notifications</h2>
                                <p className="font-data text-dark/60 mt-1 text-xs">Manage communication alerts and report delivery.</p>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-dark/10">
                                    <div>
                                        <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Email Reports</h3>
                                        <p className="font-data text-dark/50 text-xs mt-0.5">Receive weekly summary PDFs via email.</p>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" id="email-toggle" className="sr-only peer" defaultChecked />
                                        <label htmlFor="email-toggle" className="block w-11 h-6 bg-dark/20 peer-checked:bg-accent rounded-full cursor-pointer transition-colors after:content-[''] after:block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:absolute after:top-0.5 after:left-0.5 after:transition-transform peer-checked:after:translate-x-5"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-dark/10">
                                    <div>
                                        <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Critical Alerts</h3>
                                        <p className="font-data text-dark/50 text-xs mt-0.5">Instant push notifications for high-severity hazards.</p>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" id="critical-toggle" className="sr-only peer" defaultChecked />
                                        <label htmlFor="critical-toggle" className="block w-11 h-6 bg-dark/20 peer-checked:bg-accent rounded-full cursor-pointer transition-colors after:content-[''] after:block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:absolute after:top-0.5 after:left-0.5 after:transition-transform peer-checked:after:translate-x-5"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-dark/10">
                                    <div>
                                        <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-widest">Daily Digest</h3>
                                        <p className="font-data text-dark/50 text-xs mt-0.5">Summarized daily overview of all site inspections.</p>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" id="digest-toggle" className="sr-only peer" />
                                        <label htmlFor="digest-toggle" className="block w-11 h-6 bg-dark/20 peer-checked:bg-accent rounded-full cursor-pointer transition-colors after:content-[''] after:block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:absolute after:top-0.5 after:left-0.5 after:transition-transform peer-checked:after:translate-x-5"></label>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-dark/10">
                                    <label htmlFor="email-input" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Notification Email</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">Reports and alerts will be sent to this address.</p>
                                    <input
                                        id="email-input"
                                        type="email"
                                        placeholder="you@company.com"
                                        className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project Details Tab */}
                    {activeTab === 'project' && (
                        <div className="bg-paper shadow-sm border border-dark/10 rounded-[2rem] overflow-hidden">
                            <div className="p-6 border-b border-dark/10 bg-background">
                                <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">Project Details</h2>
                                <p className="font-data text-dark/60 mt-1 text-xs">Configure project-specific settings and metadata.</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label htmlFor="org-name" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Organization Name</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">This appears on generated compliance reports.</p>
                                    <input
                                        id="org-name"
                                        type="text"
                                        placeholder="Acme Construction Co."
                                        className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="project-location" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Default Site Location</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">Auto-populates site name field on new inspections.</p>
                                    <input
                                        id="project-location"
                                        type="text"
                                        placeholder="Downtown Development Site — Block 7"
                                        className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lead-inspector" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Lead Inspector</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">Default inspector assigned to new inspections.</p>
                                    <input
                                        id="lead-inspector"
                                        type="text"
                                        placeholder="Jane Smith"
                                        className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="pt-6 border-t border-dark/10">
                                    <label htmlFor="timezone" className="font-heading font-bold text-dark text-xs uppercase tracking-widest block">Timezone</label>
                                    <p className="font-data text-dark/60 text-xs mb-3 mt-1">Used for report timestamps and scheduling.</p>
                                    <select id="timezone" className="block w-full px-4 py-3 border border-dark/10 rounded-xl font-data text-sm text-dark bg-white focus:outline-none focus:border-accent">
                                        <option>America/Los_Angeles (PST)</option>
                                        <option>America/New_York (EST)</option>
                                        <option>America/Chicago (CST)</option>
                                        <option>Europe/London (GMT)</option>
                                        <option>Asia/Dubai (GST)</option>
                                        <option>Australia/Sydney (AEST)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
