import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export function Inspections() {
    const { inspections } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredInspections = inspections.filter(ins =>
        ins.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ins.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-dark/10 pb-6 mt-4">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Inspections Archive</h1>
                    <p className="font-data text-dark/60 mt-4 text-sm">A definitive log of all active and historical site safety inspections.</p>
                </div>
            </div>

            <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-dark/10 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-dark/40" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-dark/10 rounded-xl font-data text-sm placeholder-dark/40 focus:outline-none focus:border-accent bg-white"
                            placeholder="Search inspections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center px-4 py-3 border border-dark/10 text-xs font-heading font-bold uppercase rounded-xl text-dark bg-white hover:bg-dark/5 transition-colors tracking-widest">
                            <Filter className="h-4 w-4 mr-2 text-dark/40" />
                            Filters
                            <ChevronDown className="h-4 w-4 ml-2 text-dark/40" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark/10">
                        <thead className="bg-background">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left font-data text-[10px] font-bold text-dark/50 uppercase tracking-widest">ID</th>
                                <th scope="col" className="px-6 py-4 text-left font-data text-[10px] font-bold text-dark/50 uppercase tracking-widest">Site</th>
                                <th scope="col" className="px-6 py-4 text-left font-data text-[10px] font-bold text-dark/50 uppercase tracking-widest">Date</th>
                                <th scope="col" className="px-6 py-4 text-left font-data text-[10px] font-bold text-dark/50 uppercase tracking-widest">Inspector</th>
                                <th scope="col" className="px-6 py-4 text-left font-data text-[10px] font-bold text-dark/50 uppercase tracking-widest">Hazards</th>
                                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-paper divide-y divide-dark/10">
                            {filteredInspections.length > 0 ? filteredInspections.map((inspection) => (
                                <tr key={inspection.id} className="hover:bg-dark/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-data font-bold text-xs text-dark">{inspection.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-heading font-bold text-sm text-dark uppercase">{inspection.site}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-data text-xs text-dark/60">{inspection.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-data text-xs text-dark/60">{inspection.inspector}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-sm border font-data text-[10px] tracking-widest font-bold uppercase ${inspection.hazards > 0 ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {inspection.hazards} Found
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/inspections/${inspection.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-dark text-paper font-heading font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center font-data text-sm text-dark/50">
                                        No inspections found. Create a new inspection from the dashboard.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredInspections.length > 0 && (
                    <div className="bg-background px-6 py-4 border-t border-dark/10 flex items-center justify-between">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="font-data text-xs text-dark/60 uppercase tracking-widest">
                                    Showing <span className="font-bold text-dark">{filteredInspections.length}</span> result{filteredInspections.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
