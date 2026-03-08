import React, { useState } from 'react';
import { FileText, Download, BarChart3, FolderOpen, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateInspectionPDF } from '../utils/generatePDF';

export function SafetyReports() {
    const { reports, inspections, projects } = useAppContext();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Get inspections for the selected project
    const projectInspections = selectedProjectId
        ? inspections.filter(ins => ins.projectId === selectedProjectId)
        : [];

    // Get reports linked to those inspections
    const projectReports = selectedProjectId
        ? reports.filter(rep => projectInspections.some(ins => ins.id === rep.inspectionId))
        : [];

    const handleDownload = (report: typeof reports[0]) => {
        const inspection = inspections.find(ins => ins.id === report.inspectionId);
        if (inspection) {
            generateInspectionPDF(inspection);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Safety Reports</h1>
                <p className="font-data text-dark/60 mt-4 text-sm">Select a project to view and download its compliance reports.</p>
            </div>

            {/* Project Selector */}
            <div className="mb-8 bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-accent" />
                        <div>
                            <span className="font-data text-[10px] uppercase tracking-widest text-dark/50 block">Selected Project</span>
                            <span className="font-heading font-bold text-dark text-sm uppercase">
                                {selectedProject ? `${selectedProject.id} — ${selectedProject.name}` : 'Select a Project'}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                            className="inline-flex items-center px-5 py-3 border border-dark/10 rounded-full font-heading font-bold text-[10px] uppercase tracking-widest text-dark hover:bg-dark/5 transition-colors"
                        >
                            {selectedProject ? 'Change Project' : 'Select Project'} <ChevronDown className="w-3 h-3 ml-2" />
                        </button>
                        {showProjectDropdown && (
                            <div className="absolute right-0 mt-2 w-72 bg-paper border border-dark/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                {projects.length > 0 ? projects.map(proj => (
                                    <button
                                        key={proj.id}
                                        onClick={() => {
                                            setSelectedProjectId(proj.id);
                                            setShowProjectDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 hover:bg-dark/5 transition-colors border-b border-dark/5 last:border-0 ${selectedProjectId === proj.id ? 'bg-accent/5' : ''}`}
                                    >
                                        <span className="font-data text-[10px] uppercase tracking-widest text-dark/50 block">{proj.id}</span>
                                        <span className="font-heading font-bold text-sm text-dark">{proj.name}</span>
                                        <span className="font-data text-[10px] text-dark/40 block mt-0.5">{proj.createdDate}</span>
                                    </button>
                                )) : (
                                    <div className="px-4 py-6 text-center">
                                        <p className="font-data text-sm text-dark/50">No projects yet. Create one from the Dashboard.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedProject ? (
                <>
                    {/* Metrics */}
                    <h2 className="font-heading font-bold text-dark text-lg uppercase tracking-widest mb-4">Project Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mb-6">
                                <BarChart3 className="w-8 h-8 text-accent" />
                            </div>
                            <span className="font-data text-xs text-dark/60 uppercase tracking-widest block mb-2">Inspections</span>
                            <div className="text-5xl font-heading font-black text-dark">{projectInspections.length}</div>
                        </div>
                        <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-8 h-8 text-accent" />
                            </div>
                            <span className="font-data text-xs text-dark/60 uppercase tracking-widest block mb-2">Reports</span>
                            <div className="text-5xl font-heading font-black text-dark">{projectReports.length}</div>
                        </div>
                        <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mb-6">
                                <FolderOpen className="w-8 h-8 text-accent" />
                            </div>
                            <span className="font-data text-xs text-dark/60 uppercase tracking-widest block mb-2">Total Hazards</span>
                            <div className="text-5xl font-heading font-black text-dark">{projectInspections.reduce((sum, ins) => sum + ins.hazards, 0)}</div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 overflow-hidden">
                        <div className="p-6 border-b border-dark/10 bg-background">
                            <h2 className="font-heading font-bold text-dark text-lg uppercase tracking-widest">Reports for {selectedProject.name}</h2>
                        </div>
                        <ul className="divide-y divide-dark/10">
                            {projectReports.length > 0 ? projectReports.map((report) => (
                                <li key={report.id} className="p-6 hover:bg-dark/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start">
                                        <div className="bg-accent/10 p-4 rounded-[1rem] mt-0.5 border border-accent/20">
                                            <FileText className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="ml-6">
                                            <h3 className="font-heading font-bold text-dark text-lg uppercase">{report.title}</h3>
                                            <div className="mt-2 flex items-center font-data text-xs text-dark/60 font-bold uppercase tracking-widest gap-3">
                                                <span>{report.id}</span>
                                                <span>&bull;</span>
                                                <span>{report.date}</span>
                                                <span>&bull;</span>
                                                <span className="inline-flex items-center px-2 py-1 border border-dark/20 rounded-sm text-[10px] text-dark shadow-sm">
                                                    PDF
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:ml-4 sm:flex-shrink-0">
                                        <button
                                            onClick={() => handleDownload(report)}
                                            className="inline-flex items-center px-6 py-4 border border-dark text-[10px] font-heading font-bold tracking-widest uppercase rounded-full text-paper bg-dark hover:bg-accent transition-colors w-full sm:w-auto justify-center"
                                        >
                                            <Download className="w-4 h-4 mr-2 text-paper" />
                                            Download PDF
                                        </button>
                                    </div>
                                </li>
                            )) : (
                                <li className="p-12 text-center">
                                    <p className="font-data text-sm text-dark/50">No reports for this project yet. Complete an analysis from the Dashboard.</p>
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            ) : (
                <div className="bg-paper rounded-[2rem] shadow-sm border border-dark/10 p-16 text-center">
                    <div className="w-20 h-20 bg-dark/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-10 h-10 text-dark/30" />
                    </div>
                    <h2 className="font-heading font-bold text-dark text-xl uppercase tracking-widest mb-2">Select a Project</h2>
                    <p className="font-data text-dark/50 text-sm max-w-md mx-auto">Choose a project from the dropdown above to view its compliance reports and inspection data.</p>
                </div>
            )}
        </div>
    );
}
