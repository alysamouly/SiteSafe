import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hazard } from '../types';

export interface Project {
    id: string;
    name: string;
    createdDate: string;
}

export interface InspectionRecord {
    id: string;
    site: string;
    date: string;
    inspector: string;
    hazards: number;
    imageUrl: string;
    hazardDetails: Hazard[];
    reasoning: string;
    projectId: string;
}

export interface ReportRecord {
    id: string;
    title: string;
    date: string;
    size: string;
    type: string;
    inspectionId: string;
}

interface AppContextType {
    projects: Project[];
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;
    addProject: (name: string) => Project;
    inspections: InspectionRecord[];
    addInspection: (inspection: Omit<InspectionRecord, 'id'>) => InspectionRecord;
    reports: ReportRecord[];
    addReport: (report: Omit<ReportRecord, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [inspections, setInspections] = useState<InspectionRecord[]>([]);
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [nextInspectionNum, setNextInspectionNum] = useState(1);
    const [nextReportNum, setNextReportNum] = useState(1);
    const [nextProjectNum, setNextProjectNum] = useState(1);

    const addProject = (name: string): Project => {
        const id = `PRJ-${String(nextProjectNum).padStart(3, '0')}`;
        setNextProjectNum(prev => prev + 1);
        const project: Project = {
            id,
            name,
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setProjects(prev => [project, ...prev]);
        setActiveProject(project);
        return project;
    };

    const addInspection = (inspection: Omit<InspectionRecord, 'id'>): InspectionRecord => {
        const id = `INS-${String(nextInspectionNum).padStart(3, '0')}`;
        setNextInspectionNum(prev => prev + 1);
        const record = { ...inspection, id };
        setInspections((prev) => [record, ...prev]);
        return record;
    };

    const addReport = (report: Omit<ReportRecord, 'id'>) => {
        const id = `REP-${String(nextReportNum).padStart(3, '0')}`;
        setNextReportNum(prev => prev + 1);
        setReports((prev) => [{ ...report, id }, ...prev]);
    };

    return (
        <AppContext.Provider value={{ projects, activeProject, setActiveProject, addProject, inspections, addInspection, reports, addReport }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
