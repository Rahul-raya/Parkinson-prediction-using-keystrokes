import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSessionStore } from '@/store/useSessionStore';
import { ConsentGate } from '@/components/ConsentGate';
import { Activity, Shield, BarChart3, Download } from 'lucide-react';

const Index = () => {
  const { consentAccepted, setConsent, loadSessions } = useSessionStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="min-h-screen bg-background">
      <ConsentGate open={!consentAccepted} onAccept={() => setConsent(true)} />

      {/* Header */}
      <header className="border-b border-border glass-card sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Keystroke Dynamics</h1>
                <p className="text-sm text-muted-foreground">Early Detection Research</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/privacy">
                <Button variant="outline" className="gap-2 hover:border-primary/50 transition-all">
                  <Shield className="h-4 w-4" />
                  Privacy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Type. Measure. Learn.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your typing timings (not your text) help surface motor patterns that may indicate
              early changes in movement health.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-scale-in">
            <Link to="/test">
              <Button size="lg" className="text-lg px-10 py-7 gap-3 shadow-elegant hover:shadow-glow transition-all duration-300 gradient-primary border-0">
                <Activity className="h-5 w-5" />
                Start Test
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" size="lg" className="text-lg px-10 py-7 gap-3 hover:bg-primary/10 hover:border-primary transition-all duration-300">
                <Shield className="h-5 w-5" />
                Privacy & Consent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center space-y-4 glass-card hover:shadow-elegant transition-all duration-300 group animate-fade-in">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Real-Time Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              See your keystroke metrics update live as you type, including timing variance and rhythm patterns.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 glass-card hover:shadow-elegant transition-all duration-300 group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow">
              <BarChart3 className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">ML Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced algorithms analyze your typing dynamics to identify potential early motor changes.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 glass-card hover:shadow-elegant transition-all duration-300 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow">
              <Download className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Export Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Download your anonymized session data in JSON or CSV format for personal records or research.
            </p>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-10 glass-card border-primary/30 shadow-elegant animate-scale-in">
          <div className="flex gap-6 items-start">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-glow animate-pulse-slow">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We only collect timing data from your keystrokes—never the actual text you type.
                Your session is stored locally on your device, and you control when to share data.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Research tool for early motor pattern detection • Not a diagnostic device
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
