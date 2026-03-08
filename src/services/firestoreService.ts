import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    Unsubscribe,
    increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Hazard } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProjectDoc {
    name: string;
    createdDate: string;
    createdAt: Timestamp;
}

export interface InspectionDoc {
    site: string;
    date: string;
    inspector: string;
    hazards: number;
    imageUrl: string;
    hazardDetails: Hazard[];
    reasoning: string;
    projectId: string;
    createdAt: Timestamp;
}

export interface ReportDoc {
    title: string;
    date: string;
    size: string;
    type: string;
    inspectionId: string;
    createdAt: Timestamp;
}

export interface SettingsDoc {
    analysisStrictness: 'lenient' | 'normal' | 'strict';
    complianceStandard: string;
    emailReports: boolean;
    criticalAlerts: boolean;
    dailyDigest: boolean;
    notificationEmail: string;
    orgName: string;
    defaultSiteLocation: string;
    leadInspector: string;
    timezone: string;
}

// ─── Collection References ───────────────────────────────────────────────────

const COUNTERS_DOC = 'counters/main';
const SETTINGS_DOC = 'settings/main';

// ─── Counter Helpers ─────────────────────────────────────────────────────────

async function getNextId(field: 'projects' | 'inspections' | 'reports'): Promise<number> {
    const counterRef = doc(db, COUNTERS_DOC);
    const snap = await getDoc(counterRef);

    if (!snap.exists()) {
        // Initialize counters
        await setDoc(counterRef, { projects: 1, inspections: 1, reports: 1 });
        return 1;
    }

    const current = snap.data()[field] || 0;
    const next = current + 1;
    await updateDoc(counterRef, { [field]: next });
    return current;
}

function formatId(prefix: string, num: number): string {
    return `${prefix}-${String(num).padStart(3, '0')}`;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function createProject(name: string) {
    const num = await getNextId('projects');
    const id = formatId('PRJ', num);
    const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    await setDoc(doc(db, 'projects', id), {
        name,
        createdDate,
        createdAt: Timestamp.now(),
    } as ProjectDoc);

    return { id, name, createdDate };
}

export function subscribeToProjects(callback: (projects: Array<{ id: string; name: string; createdDate: string }>) => void): Unsubscribe {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({
            id: d.id,
            name: d.data().name as string,
            createdDate: d.data().createdDate as string,
        }));
        callback(projects);
    });
}

// ─── Inspections ─────────────────────────────────────────────────────────────

export async function createInspection(data: Omit<InspectionDoc, 'createdAt'>) {
    const num = await getNextId('inspections');
    const id = formatId('INS', num);

    await setDoc(doc(db, 'inspections', id), {
        ...data,
        createdAt: Timestamp.now(),
    });

    return { ...data, id };
}

export function subscribeToInspections(callback: (inspections: Array<{
    id: string; site: string; date: string; inspector: string;
    hazards: number; imageUrl: string; hazardDetails: Hazard[];
    reasoning: string; projectId: string;
}>) => void): Unsubscribe {
    const q = query(collection(db, 'inspections'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const inspections = snapshot.docs.map(d => {
            const data = d.data();
            return {
                id: d.id,
                site: data.site as string,
                date: data.date as string,
                inspector: data.inspector as string,
                hazards: data.hazards as number,
                imageUrl: data.imageUrl as string,
                hazardDetails: (data.hazardDetails || []) as Hazard[],
                reasoning: data.reasoning as string,
                projectId: data.projectId as string,
            };
        });
        callback(inspections);
    });
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function createReport(data: Omit<ReportDoc, 'createdAt'>) {
    const num = await getNextId('reports');
    const id = formatId('REP', num);

    await setDoc(doc(db, 'reports', id), {
        ...data,
        createdAt: Timestamp.now(),
    });

    return { ...data, id };
}

export function subscribeToReports(callback: (reports: Array<{
    id: string; title: string; date: string; size: string;
    type: string; inspectionId: string;
}>) => void): Unsubscribe {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const reports = snapshot.docs.map(d => {
            const data = d.data();
            return {
                id: d.id,
                title: data.title as string,
                date: data.date as string,
                size: data.size as string,
                type: data.type as string,
                inspectionId: data.inspectionId as string,
            };
        });
        callback(reports);
    });
}

// ─── Settings ────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SettingsDoc = {
    analysisStrictness: 'normal',
    complianceStandard: 'OSHA (United States)',
    emailReports: true,
    criticalAlerts: true,
    dailyDigest: false,
    notificationEmail: '',
    orgName: '',
    defaultSiteLocation: '',
    leadInspector: '',
    timezone: 'America/Los_Angeles (PST)',
};

export async function loadSettings(): Promise<SettingsDoc> {
    const snap = await getDoc(doc(db, SETTINGS_DOC));
    if (!snap.exists()) {
        await setDoc(doc(db, SETTINGS_DOC), DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }
    return snap.data() as SettingsDoc;
}

export async function saveSettings(settings: Partial<SettingsDoc>): Promise<void> {
    const ref = doc(db, SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { ...DEFAULT_SETTINGS, ...settings });
    } else {
        await updateDoc(ref, settings);
    }
}

export function subscribeToSettings(callback: (settings: SettingsDoc) => void): Unsubscribe {
    return onSnapshot(doc(db, SETTINGS_DOC), (snap) => {
        if (snap.exists()) {
            callback(snap.data() as SettingsDoc);
        } else {
            callback(DEFAULT_SETTINGS);
        }
    });
}
