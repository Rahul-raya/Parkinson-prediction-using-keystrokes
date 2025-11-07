import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { KeystrokeEvent, SessionFeatures } from '@/lib/featureExtractor';

export interface PatientInfo {
  dateOfBirth: string;
  age: number;
}

export interface Session {
  sessionId: string;
  startedAt: string;
  endedAt: string | null;
  consent: boolean;
  patientInfo: PatientInfo | null;
  deviceInfo: {
    ua: string;
    platform: string;
  };
  promptVariant: string;
  promptText: string;
  raw: KeystrokeEvent[];
  features: SessionFeatures | null;
  status: 'idle' | 'recording' | 'paused' | 'analyzing' | 'done';
}

export interface Prediction {
  label: 'Likely Healthy' | 'Possible Early PD';
  confidence: number;
  feature_contributions: Record<string, number>;
}

interface SessionState {
  consentAccepted: boolean;
  patientInfo: PatientInfo | null;
  currentSession: Session | null;
  sessions: Session[];
  currentPrediction: Prediction | null;
  
  setConsent: (accepted: boolean) => void;
  setPatientInfo: (info: PatientInfo) => void;
  startSession: (promptText: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  addKeystroke: (event: KeystrokeEvent) => void;
  updateFeatures: (features: SessionFeatures) => void;
  setStatus: (status: Session['status']) => void;
  setPrediction: (prediction: Prediction) => void;
  saveSession: () => void;
  loadSessions: () => void;
  deleteSession: (sessionId: string) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  consentAccepted: false,
  patientInfo: null,
  currentSession: null,
  sessions: [],
  currentPrediction: null,

  setConsent: (accepted) => {
    set({ consentAccepted: accepted });
    if (accepted) {
      localStorage.setItem('keystroke_consent', 'true');
    }
  },

  setPatientInfo: (info) => {
    set({ patientInfo: info });
    localStorage.setItem('keystroke_patient_info', JSON.stringify(info));
  },

  startSession: (promptText) => {
    const session: Session = {
      sessionId: uuidv4(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      consent: get().consentAccepted,
      patientInfo: get().patientInfo,
      deviceInfo: {
        ua: navigator.userAgent,
        platform: navigator.platform,
      },
      promptVariant: 'Typing prompt',
      promptText,
      raw: [],
      features: null,
      status: 'recording',
    };
    set({ currentSession: session, currentPrediction: null });
  },

  pauseSession: () => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: { ...session, status: 'paused' },
      });
    }
  },

  resumeSession: () => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: { ...session, status: 'recording' },
      });
    }
  },

  resetSession: () => {
    set({ currentSession: null, currentPrediction: null });
  },

  addKeystroke: (event) => {
    const session = get().currentSession;
    if (session && session.status === 'recording') {
      set({
        currentSession: {
          ...session,
          raw: [...session.raw, event],
        },
      });
    }
  },

  updateFeatures: (features) => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: { ...session, features },
      });
    }
  },

  setStatus: (status) => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: { ...session, status },
      });
    }
  },

  setPrediction: (prediction) => {
    set({ currentPrediction: prediction });
  },

  saveSession: () => {
    const session = get().currentSession;
    if (session) {
      const updatedSession = {
        ...session,
        endedAt: new Date().toISOString(),
        status: 'done' as const,
      };

      const sessions = get().sessions;
      const updatedSessions = [...sessions, updatedSession];
      
      set({ sessions: updatedSessions });
      localStorage.setItem('keystroke_sessions', JSON.stringify(updatedSessions));
    }
  },

  loadSessions: () => {
    const stored = localStorage.getItem('keystroke_sessions');
    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        set({ sessions });
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }

    const consent = localStorage.getItem('keystroke_consent');
    if (consent === 'true') {
      set({ consentAccepted: true });
    }

    const patientInfo = localStorage.getItem('keystroke_patient_info');
    if (patientInfo) {
      try {
        set({ patientInfo: JSON.parse(patientInfo) });
      } catch (error) {
        console.error('Failed to load patient info:', error);
      }
    }
  },

  deleteSession: (sessionId) => {
    const sessions = get().sessions.filter(s => s.sessionId !== sessionId);
    set({ sessions });
    localStorage.setItem('keystroke_sessions', JSON.stringify(sessions));
  },
}));
