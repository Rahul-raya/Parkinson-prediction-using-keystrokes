import { useSessionStore } from '@/store/useSessionStore';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sparkles, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getRandomPrompt } from '@/lib/typingPrompts';

export function SessionToolbar() {
  const {
    currentSession,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    saveSession,
    consentAccepted,
    patientInfo,
  } = useSessionStore();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!consentAccepted) {
      toast.error('Please accept the consent form before starting.');
      return;
    }
    if (!patientInfo) {
      toast.error('Please provide patient information first.');
      return;
    }
    const prompt = getRandomPrompt();
    startSession(prompt);
    toast.success('Recording started! Type the text shown above.');
  };

  const handlePause = () => {
    if (currentSession?.status === 'recording') {
      pauseSession();
      toast.info('Recording paused. Click Resume to continue.');
    } else if (currentSession?.status === 'paused') {
      resumeSession();
      toast.success('Recording resumed. Continue typing.');
    }
  };

  const handleReset = () => {
    resetSession();
    toast.success('Session reset. Start a new recording session.');
  };

  const handleAnalyze = () => {
    if (!currentSession || currentSession.raw.length < 10) {
      toast.error('Please type at least 10 keystrokes before analyzing.');
      return;
    }
    saveSession();
    navigate('/results');
  };

  const handleExportJSON = () => {
    if (!currentSession) return;

    const data = JSON.stringify(currentSession, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${currentSession.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Session data exported as JSON.');
  };

  const handleExportCSV = () => {
    if (!currentSession) return;

    const headers = ['key', 'code', 'pressTs', 'releaseTs', 'holdTime', 'flightTime', 'latencyTime', 'isError'];
    const rows = currentSession.raw.map(e => [
      e.key,
      e.code,
      e.pressTs.toString(),
      e.releaseTs.toString(),
      e.holdTime.toString(),
      e.flightTime?.toString() || '',
      e.latencyTime?.toString() || '',
      e.isError.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${currentSession.sessionId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Session data exported as CSV.');
  };

  const isRecording = currentSession?.status === 'recording';
  const isPaused = currentSession?.status === 'paused';
  const hasSession = currentSession !== null;

  return (
    <div className="flex flex-wrap gap-3 animate-fade-in">
      {!hasSession ? (
        <Button onClick={handleStart} size="lg" className="gap-2 bg-primary text-primary-foreground rounded-2xl shadow-soft hover:shadow-glow transition-all duration-200">
          <Play className="h-5 w-5" />
          Start Recording
        </Button>
      ) : (
        <>
          <Button
            onClick={handlePause}
            variant={isRecording ? 'secondary' : 'default'}
            size="lg"
            className="gap-2 rounded-2xl shadow-soft transition-all duration-200"
          >
            {isRecording ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Resume
              </>
            )}
          </Button>

          <Button onClick={handleReset} variant="outline" size="lg" className="gap-2 rounded-2xl hover:bg-secondary transition-all duration-200">
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>

          <Button
            onClick={handleAnalyze}
            variant="default"
            size="lg"
            className="gap-2 bg-primary text-primary-foreground rounded-2xl shadow-soft hover:shadow-glow transition-all duration-200"
            disabled={!currentSession || currentSession.raw.length < 10}
          >
            <Sparkles className="h-5 w-5" />
            Analyze
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              size="lg"
              className="gap-2 rounded-2xl hover:bg-secondary transition-all duration-200"
            >
              <Download className="h-5 w-5" />
              JSON
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="lg"
              className="gap-2 rounded-2xl hover:bg-secondary transition-all duration-200"
            >
              <Download className="h-5 w-5" />
              CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
