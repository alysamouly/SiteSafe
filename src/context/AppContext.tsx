import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hazard } from '../types';
import {
    createProject as fbCreateProject,
    createInspection as fbCreateInspection,
    createReport as fbCreateReport,
    subscribeToProjects,
    subscribeToInspections,
    subscribeToReports,
    subscribeToSettings,
    saveSettings as fbSaveSettings,
    DEFAULT_SETTINGS,
    SettingsDoc,
} from '../services/firestoreService';

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
    addProject: (name: string) => Promise<Project>;
    inspections: InspectionRecord[];
    addInspection: (inspection: Omit<InspectionRecord, 'id'>) => Promise<InspectionRecord>;
    reports: ReportRecord[];
    addReport: (report: Omit<ReportRecord, 'id'>) => Promise<void>;
    settings: SettingsDoc;
    updateSettings: (settings: Partial<SettingsDoc>) => Promise<void>;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [inspections, setInspections] = useState<InspectionRecord[]>([]);
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [settings, setSettings] = useState<SettingsDoc>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Subscribe to real-time Firestore data
    useEffect(() => {
        let loadedCount = 0;
        const totalCollections = 4;

        const markLoaded = () => {
            loadedCount++;
            if (loadedCount >= totalCollections) setIsLoading(false);
        };

        const unsubProjects = subscribeToProjects((data) => {
            setProjects(data);
            markLoaded();
        });

        const unsubInspections = subscribeToInspections((data) => {
            setInspections(data);
            markLoaded();
        });

        const unsubReports = subscribeToReports((data) => {
            setReports(data);
            markLoaded();
        });

        const unsubSettings = subscribeToSettings((data) => {
            setSettings(data);
            markLoaded();
        });

        return () => {
            unsubProjects();
            unsubInspections();
            unsubReports();
            unsubSettings();
        };
    }, []);

    const addProject = async (name: string): Promise<Project> => {
        const project = await fbCreateProject(name);
        setActiveProject(project);
        return project;
    };

    const addInspection = async (inspection: Omit<InspectionRecord, 'id'>): Promise<InspectionRecord> => {
        const record = await fbCreateInspection(inspection);
        return record as InspectionRecord;
    };

    const addReport = async (report: Omit<ReportRecord, 'id'>): Promise<void> => {
        await fbCreateReport(report);
    };

    const updateSettings = async (partial: Partial<SettingsDoc>): Promise<void> => {
        await fbSaveSettings(partial);
    };

    return (
        <AppContext.Provider value={{
            projects, activeProject, setActiveProject,
            addProject, inspections, addInspection,
            reports, addReport,
            settings, updateSettings,
            isLoading,
        }}>
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
