import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/useSessionStore';
import { ConsentGate } from '@/components/ConsentGate';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { TypingPad } from '@/components/TypingPad';
import { LiveDashboard } from '@/components/LiveDashboard';
import { SessionToolbar } from '@/components/SessionToolbar';
import { Activity, ArrowLeft } from 'lucide-react';

const Test = () => {
  const navigate = useNavigate();
  const { consentAccepted, setConsent, loadSessions, patientInfo, currentSession } = useSessionStore();
  const [showPatientForm, setShowPatientForm] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (consentAccepted && !patientInfo) {
      setShowPatientForm(true);
    }
  }, [consentAccepted, patientInfo]);

  return (
    <div className="min-h-screen bg-background">
      <ConsentGate open={!consentAccepted} onAccept={() => setConsent(true)} />

      {/* Progress Bar */}
      {currentSession && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-[60]">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${currentSession.raw.length > 0 ? Math.min((currentSession.raw.length / 500) * 100, 100) : 0}%` 
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-secondary transition-colors rounded-xl">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Typing Test</h1>
                  <p className="text-sm text-muted-foreground">Real-time keystroke analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8 max-w-7xl mx-auto">
          {showPatientForm ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <PatientInfoForm onComplete={() => setShowPatientForm(false)} />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <SessionToolbar />

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Typing Pad */}
                <div>
                  <TypingPad />
                </div>

                {/* Right: Live Dashboard */}
                <div>
                  <LiveDashboard />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Test;
